with cte as
(
	select
		*
	,	row_number() over (partition by eqp_code order by insert_dt desc) as row_no
	from
		tb_diwater_down_history
	where
		(start_dt between @from_dt and @to_dt) or (end_dt between @from_dt and @to_dt)
)
select
	*
from
	cte
where
	row_no = '1'