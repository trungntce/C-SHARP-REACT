--declare @eqp_code varchar(40) = 'M-181-01-V003';  	 	--변수
--declare @to_dt datetime = getdate()    				 	--변수	
--declare @from_dt datetime = dateadd(ss,-60*60,@to_dt)		--변수
 

--select
--	@from_dt as from_dt
--,	@to_dt	as to_dt
--;

declare @table_name varchar(70);
declare @collect_type char(1);

declare	@am8 datetime;

declare @plc_query nvarchar(max);

declare @tbl_start TABLE	--pc설비들은 각 로우데이터 테이블마다 조건이 다름. 공통적인 부분까지 작업 해야됨.
(
	diff_over5min	int
);


-- 8시 기준(8시 이후인 경우 오늘 오전8시, 8시 이전인 경우 어제 오전8시
select @am8 = dateadd(hour, 8, cast(cast(GETDATE()  as date) as datetime));

if datepart(hour, GETDATE()) < 8
	select @am8 = dateadd(dd, -1, @am8);

-- 설비 코드로 pc/plc 설비 인지 구분
with cte as
(
	select distinct
		equip		as eqp_code
	,	'P' as raw_type		--pc 설비
	,	tablename
	from 
		dbo.raw_pc_infotable
	where
		equip not in ('M-102-01-V001')
		and tablename not in ('raw_vrs_orbotech_error')
	union
	select distinct
		eqcode		as eqp_code
	,	'L' as raw_type		--plc 설비
	,	tablename
	from
		dbo.raw_plcsymbol_infotable
	where eqcode not in ('M-119-03-V002')		-- M-119-03-V002 pc/plc 둘 다 해당 됨. pc설비 수집 설비코드
)select
	@table_name = tablename
,	@collect_type = raw_type
from
	cte
where
	eqp_code = @eqp_code
;

if @collect_type = 'P'
begin
	if @table_name = 'raw_aoi_orbotech'
		begin
			with cte AS
			(
				select
					lead(panelnumber,1) OVER (PARTITION BY equip ORDER BY dasinserttime desc) AS prev_panel
				,	panelnumber AS panel
				,	dasinserttime
				from
					dbo.raw_aoi_orbotech
				where
					equip = @eqp_code and dasinserttime between @from_dt and @to_dt
			),cte2 AS 
			(
				select
					*
				from
					cte
				where
					panel != prev_panel
			),cte_diff as
			(
			select
				*
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) as diff
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) - 5 * 60 as diff_over5min
			from
				cte
			)insert into @tbl_start
			 select diff_over5min from cte_diff
		end
	else if @table_name = 'raw_bbt_yamaha_mpd'
		begin
			with cte AS 
			(
				select
					[time] 
				,	mesdate 
				,	dasinserttime 
				from
					dbo.raw_bbt_yamaha_mpd
				where
					equip = @eqp_code and dasinserttime between @from_dt and @to_dt
			),cte_diff as
			(
			select
				*
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) as diff
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) - 5 * 60 as diff_over5min
			from
				cte
			)insert into @tbl_start
			 select diff_over5min from cte_diff
		END
	else if @table_name = 'raw_laser'
		begin	
			with cte as
			(
				select
					*
				from
					dbo.raw_laser
				where passes = '1' and equip = @eqp_code and dasinserttime between @from_dt and @to_dt
			),cte_diff as
			(
			select
				*
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) as diff
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) - 5 * 60 as diff_over5min
			from
				cte
			)insert into @tbl_start
			 select diff_over5min from cte_diff
		end
	else if @table_name = 'raw_vacuumhp'
		begin
			with cte as
			(
				select
					equip
				, 	filenametime as starttime
				, 	max(time) as endtime
				,	max(dasinserttime) as dasinserttime
				from 
					dbo.raw_vacuumhp
				where
					mesdate = convert(varchar, @am8, 23) and equip = @eqp_code
				group by 
					equip
				,	filenametime
			),cte2 AS 
			(
				select
					*
				,	lag(endtime,1) over (order by dasinserttime) as prev_end
				from
					cte
			),cte_diff as
			(
        		select
        	        *
        		,	datediff(ss, prev_end, starttime) - 5 * 60 as diff_over5min
        		,   datediff(ss, lag(starttime) over (order by dasinserttime), starttime) as diff
        		from
                	cte2
			)insert into @tbl_start
			 select diff_over5min from cte_diff
		end
	else if @table_name = 'raw_qr'
		begin
			with cte as 
			(
				select
					equip 
				,	starttime
				,	max(dasinserttime) as dasinserttime
				from
					raw_qr
				where
					equip = @eqp_code and dasinserttime between @from_dt and @to_dt
				group by 
					equip, starttime
			),cte_diff as
			(
			select
				*
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) as diff
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) - 5 * 60 as diff_over5min
			from
				cte
			)insert into @tbl_start
			 select diff_over5min from cte_diff
		END
	else if @table_name = 'raw_vrs_orbotech_count'
		begin	
			with cte AS 
			(
				select
					dasinserttime
				from
					dbo.raw_vrs_orbotech_count
				where
					equip = @eqp_code and dasinserttime between @from_dt and @to_dt
					and message = 'message: table_move_to(): index =0, x=0, y=24000'
			),cte_diff as
			(
			select
				*
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) as diff
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) - 5 * 60 as diff_over5min
			from
				cte
			)insert into @tbl_start
			 select diff_over5min from cte_diff
		end
	else if @table_name = 'raw_exposure_nuvogo'
		begin
			with cte AS 
			(
				select
					dasinserttime
				from
					dbo.raw_exposure_nuvogo
				where
					equip = @eqp_code and dasinserttime between @from_dt and @to_dt
			),cte_diff as
			(
			select
				*
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) as diff
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) - 5 * 60 as diff_over5min
			from
				cte
			)insert into @tbl_start
			 select diff_over5min from cte_diff
		end
	else if @table_name = 'raw_psrdi_screen'
		begin
			with cte as
			(
				select
					dasinserttime 
				from
					dbo.raw_psrdi_screen
				where
					equip = @eqp_code and dasinserttime between @from_dt and @to_dt
			),cte_diff as
			(
			select
				*
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) as diff
			,	datediff(ss, isnull(lag(dasinserttime) over (order by dasinserttime asc),@am8 ), dasinserttime) - 5 * 60 as diff_over5min
			from
				cte
			)insert into @tbl_start
			 select diff_over5min from cte_diff
		end
	else
		begin
			select -1 as non_time;
		end;
	
	with cte as 
	(
		select
			sum(diff_over5min) as sum_diff_over5min
		,	datediff(ss, @am8, GETDATE()) as total_time
		from
			@tbl_start
		where
			diff_over5min > 0
	)
	select
		case when sum_diff_over5min is null then datediff(ss,@am8,GETDATE()) else sum_diff_over5min end AS non_time
	--,	(1 - cast( case when sum_diff_over10min is null then datediff(ss,@am8,GETDATE()) else sum_diff_over10min end as numeric ) / cast(total_time as numeric )) * 100 
	from
		cte
	;
end
else if @collect_type = 'L' --plc 설비  Run/Down 초 단위 계산
begin
	SET @plc_query = N'
	with cte_raw as
	(
		select
			row_number() over (order by inserttime desc) as row_no
		,	*
		from
			dbo.'+ @table_name + '
		where
			inserttime >='+ '''' + convert(varchar,@from_dt,20) + '''' + 
			' and inserttime <= ' + '''' + convert(varchar,@to_dt,20) +'''' +'
	), cte_part as
	(
		select
			row_number() over (partition by eqstatus order by row_no) as part_no
		,	*
		from
			cte_raw
	), cte_status_group as
	(
		select
			eqstatus
		,	min(inserttime) as min_dt
		,	max(inserttime) as max_dt
		from 
			cte_part
		group by
			eqstatus, row_no - part_no
	), cte_diff as
	(
		select
			*
		,	datediff(ss, min_dt, max_dt) as diff
		from
			cte_status_group
	)
	select isnull(sum(convert(int, diff)),0) as non_time from cte_diff where eqstatus = ' + '''' + 'Down' + '''
'
	exec sp_executesql @plc_query
end
else
begin
	select -1 as non_time
end
