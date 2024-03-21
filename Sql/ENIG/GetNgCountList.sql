
declare @twoMago_start date = DATEADD(MONTH, -2, DATEADD(DAY, 1-DAY(GETDATE()), GETDATE()));
declare @twoMago_end date = EOMONTH(DATEADD(MONTH, -2, GETDATE()));
declare @oneMago_start date = DATEADD(MONTH, -1, DATEADD(DAY, 1-DAY(GETDATE()), GETDATE()));
declare @oneMago_end date = EOMONTH(DATEADD(MONTH, -1, GETDATE()));
declare @thisMago_start date = DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE()), 0);
declare @thisMago_end date = EOMONTH(GETDATE());

declare @tbl_res table
(
	eqp_code 			varchar(40)
,	two_month_ago 	int
,	one_month_ago 	int
,	this_month_ago  int
,	seven_day_ago 	int
,	six_day_ago 	int
,	five_day_ago 	int
,	four_day_ago	int
,	three_day_ago 	int
,	two_day_ago 	int
,	one_day_ago 	int
);

with cte as 
(
	select
		a.converttime
	,	{0}
	,	b.inserttime 
	,	case when {0} < 0.5 or {0} > 1.0 then 'ng' else 'ok' end as status
	from
		(
			select
				min(inserttime) as inserttime
			,	DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
			from
				dbo.{1}
			where
				inserttime >= @twoMago_start and inserttime <= @thisMago_end
			group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
		) a
	join
		dbo.{1} b
		on a.inserttime = b.inserttime
),cte2 as 
(
	select 
		row_number() over (order by converttime desc) as row_no
	,	*
	from
		cte
),cte3 as 
(
	select
		row_number() over (partition by status order by row_no) as part_no
	,	*
	from
		cte2
),cte4 as 
(
	select
		status
	,	min(converttime) as min_dt
	,	max(converttime) as max_dt
	from	
		cte3
	group by 
		status, row_no - part_no
),cte5 as 
(
	select
		@eqp_name + '_Voltage' as eqp_code
	,	sum(case when min_dt >= @twoMago_start and max_dt <= @twoMago_end and cte4.status = 'ng' then 1 else 0 end) as two_month_ago 
	,	sum(case when min_dt >= @oneMago_start and max_dt <= @oneMago_end and cte4.status = 'ng' then 1 else 0 end) as one_month_ago
	,	sum(case when min_dt >= @thisMago_start and max_dt <= @thisMago_end then 1 else 0 end) as this_month_ago 
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-7,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-6,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as seven_day_ago
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-6,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-5,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as six_day_ago
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-5,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-4,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as five_day_ago 
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-4,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-3,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as four_day_ago 
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-3,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-2,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as three_day_ago
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-2,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-1,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as two_day_ago 
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-1,GETDATE()) AS DATE) and max_dt < CAST(GETDATE() AS DATE) and cte4.status = 'ng' then 1 else 0 end)				 as one_day_ago 
	from
		cte4
)insert into @tbl_res
select * from cte5;

with cte as 
(
	select
		a.converttime
	,	{2}
	,	b.inserttime 
	,	case when {2} > 0.5 then 'ng' else 'ok' end as status
	from
		(
			select
				min(inserttime) as inserttime
			,	DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
			from
				dbo.{3}
			where
				inserttime >= @twoMago_start and inserttime <= @thisMago_end
			group by DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0)
		) a
	join
		dbo.{3} b
		on a.inserttime = b.inserttime
),cte2 as 
(
	select 
		row_number() over (order by converttime desc) as row_no
	,	*
	from
		cte
),cte3 as 
(
	select
		row_number() over (partition by status order by row_no) as part_no
	,	*
	from
		cte2
),cte4 as 
(
	select
		status
	,	min(converttime) as min_dt
	,	max(converttime) as max_dt
	from	
		cte3
	group by 
		status, row_no - part_no
),cte5 as 
(
	select
		@eqp_name + '_Current' as eqp_code
	,	sum(case when min_dt >= @twoMago_start and max_dt <= @twoMago_end and cte4.status = 'ng' then 1 else 0 end) as two_month_ago 
	,	sum(case when min_dt >= @oneMago_start and max_dt <= @oneMago_end and cte4.status = 'ng' then 1 else 0 end) as one_month_ago
	,	sum(case when min_dt >= @thisMago_start and max_dt <= @thisMago_end then 1 else 0 end) as this_month_ago 
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-7,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-6,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as seven_day_ago
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-6,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-5,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as six_day_ago
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-5,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-4,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as five_day_ago 
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-4,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-3,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as four_day_ago 
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-3,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-2,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as three_day_ago
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-2,GETDATE()) AS DATE) and max_dt < CAST(DATEADD(DAY,-1,GETDATE()) AS DATE) and cte4.status = 'ng' then 1 else 0 end) as two_day_ago 
	,	sum(case when min_dt >= CAST(DATEADD(DAY,-1,GETDATE()) AS DATE) and max_dt < CAST(GETDATE() AS DATE) and cte4.status = 'ng' then 1 else 0 end)				 as one_day_ago 
	from
		cte4
)insert into @tbl_res
select * from cte5

select 
	* 
from
	@tbl_res