--declare @from_dt datetime = '2023-08-02 05:00:00'; 	--변수
--declare @to_dt datetime = getdate();				--변수
--declare @eqp_code varchar(40) = 'M-117-01-V006';	--변수

with cte as
(
	select
		row_number() over (partition by eqp_code order by create_dt asc) as row_no
	,	*
	from
		tb_healthcheck_history
	where
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
	,	case when datediff(ss,create_dt,next_create_dt) > (5 * 60) then datediff(ss,create_dt,next_create_dt) - (5 * 60)  else 0 end as over_5min 
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
	where
		1 = 1
		and type_code like '%' + @type_code + '%'
		and eqp_code like '%' + @eqp_code + '%'
	group by eqp_code, type_code
)select
	a.eqp_code
,	b.hc_name as eqp_desc
,	a.type_code 
,	isnull(a.over_value_sum,0) as over_value_sum
,	isnull(a.total_time,0) as total_time
from
	cte4 a
join
	dbo.tb_healthcheck b on a.eqp_code = b.hc_code 
where
	1 = 1
	and b.hc_name like '%' + @eqp_name + '%'

;