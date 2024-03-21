declare @from_dt datetime = '2023-07-27 08:05:00'; 	--변수
declare @to_dt datetime = getdate();				--변수
declare @eqp_code varchar(40) = 'M-089-02-V001';	--변수


declare @over_value int = 5 * 60; --5분 이상

with cte as
(
	select
		row_number() over (partition by eqp_code order by create_dt asc) as row_no
	,	*
	from
		tb_healthcheck_history
	where
		eqp_code = @eqp_code and
		create_dt between convert(varchar, @from_dt, 120) and convert (varchar, @to_dt, 120)
		and type_code != 'S'
),cte2 as
(
	select
		*
	,	isnull(lead(create_dt,1) over (partition by eqp_code order by create_dt asc),@to_dt) as next_create_dt
	from
		cte
),cte3 as
(
	select
		*
	,	datediff(ss,create_dt,next_create_dt) AS diff
	,	case when datediff(ss,create_dt,next_create_dt) > @over_value then datediff(ss,create_dt,next_create_dt) - @over_value  else 0 end as over_5min 
	from
		cte2
),cte4 as
(
	select
		eqp_code
	,	type_code
	,	sum(over_5min) as over_value_sum
	,	datediff(ss,@from_dt,@to_dt) as total_time
	from
		cte3
	group by eqp_code, type_code
)
select
	*
,	(cast(over_value_sum as numeric) / total_time) * 100 as rate_value
from
	cte4
;