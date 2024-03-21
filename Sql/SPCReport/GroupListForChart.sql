with cte as
(
	select
		param_id
	,	max(std) as std
	,	max(lcl) as lcl
	,	max(ucl) as ucl
	,	max(lsl) as lsl
	,	max(usl) as usl
	,	min(eqp_min_val)	as eqp_min_val
	,	max(eqp_max_val)	as eqp_max_val
	,	avg(eqp_avg_val)	as eqp_avg_val
	,	max(table_name)		as table_name
	,	min(eqp_start_dt)	as eqp_start_dt
	,	min(eqp_end_dt)		as eqp_end_dt
	,	max(column_name)	as column_name
	from
		dbo.tb_panel_param_cuplating
	where
		group_key = @group_key
	group by
		param_id
)
select
	cte.*
,	replace(column_name, 'd00', 'Data') as param_name
from
	cte
;