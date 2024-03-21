declare @am8 datetime;
	select @am8 = dateadd(hour, 8, cast(cast(getdate() as date) as datetime));

if datepart(hour, getdate()) < 8
	select @am8 = dateadd(dd, -1, @am8);

with cte_item as 
(
	select
		code_id		as eqp_code
	,	code_name	as eqp_name
	from
		tb_code
	where
		code_id = @eqp_code
),cte_time_split as 
(
	select
		b.eqcode 		as eqp_code
	,	a.converttime	as std_time
	,	b.{2}			as value
	,	case when {1} then 'ng' else 'ok' end as status
	from
		(
			select
				min(inserttime) as inserttime
			,	DATEADD(MINUTE, DATEDIFF(MINUTE, 0, inserttime) / 5 * 5, 0) as converttime
			from
				dbo.{3}
			where
				inserttime >= cast(dateadd(month, -2, dateadd(DAY, 1-DAY(@am8), getdate())) as date) and inserttime < '2024-01-14 16:30:00'
			group by dateadd(mi, datediff(mi, 0, inserttime) / 5 * 5, 0)
		) a
	join
		dbo.{3} b
		on a.inserttime = b.inserttime 
),cte2 as 
(
select
	row_number() over(order by std_time desc) as row_no
,	*
from
	cte_time_split	
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
		eqp_code
	,	status
	,	min(std_time) as start_dt
	,	max(std_time) as end_dt
	,	min(value) 	  as min_val
	, 	max(value)	  as max_val 
	from
		cte3
	where
		status = 'ng'
	group by eqp_code, status, row_no - part_no
),cte_month as 
(
	select
		eqp_code 
	,	month(start_dt) as month_num
	,	count(*) as cnt
	from
		cte4 
	where
		start_dt >= cast(dateadd(month, -2, dateadd(DAY, 1-DAY(@am8), getdate())) as date) and start_dt < cast(@am8 as date)
	group by eqp_code, month(start_dt)
),cte_day as 
(
	select
		eqp_code
	,	day(start_dt) as day_num
	,	count(*) as cnt 
	from
		cte4
	where
		start_dt >= dateadd(day,-7,cast(@am8 as date)) and start_dt < cast(@am8 as date)
	group by 
		eqp_code, day(start_dt)
)
select
	item.eqp_code
,	max(item.eqp_name) as eqp_name
,	max(case when a.month_num = datepart(month ,dateadd(month,-2,@am8))  then a.cnt else 0 end) as ago2month
,	max(case when a.month_num = datepart(month ,dateadd(month,-1,@am8))  then a.cnt else 0 end) as ago1month
,	max(case when a.month_num = datepart(month , @am8)  then a.cnt else 0 end) as cur_month
,	max(case when b.day_num = datepart(day , dateadd(day,-7,@am8)) then b.cnt else 0 end) as ago7day
,	max(case when b.day_num = datepart(day , dateadd(day,-6,@am8)) then b.cnt else 0 end) as ago6day
,	max(case when b.day_num = datepart(day , dateadd(day,-5,@am8)) then b.cnt else 0 end) as ago5day
,	max(case when b.day_num = datepart(day , dateadd(day,-4,@am8)) then b.cnt else 0 end) as ago4day
,	max(case when b.day_num = datepart(day , dateadd(day,-3,@am8)) then b.cnt else 0 end) as ago3day
,	max(case when b.day_num = datepart(day , dateadd(day,-2,@am8)) then b.cnt else 0 end) as ago2day
,	max(case when b.day_num = datepart(day , dateadd(day,-1,@am8)) then b.cnt else 0 end) as ago1day
,	case when upper(@param_name) like '%DIWATER%' then 'diwater'
		when upper(@param_name) like '%INPUT%' then 'input'
		when upper(@param_name) like '%OUTPUT%' then 'output' end as param_name
from
	cte_item item
left join
	cte_month a
	on item.eqp_code = a.eqp_code
left join
	cte_day b
	on item.eqp_code = b.eqp_code
group by item.eqp_code
;

