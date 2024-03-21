with cte as 
(
	select
		tp.eqp_code 
	,	tp.table_name 
	,	tp.column_name 
	,	case when tp.param_name like '%DIWATER%' then 1 
			when tp.param_name like '%INPUT%' then 2
			when tp.param_name like '%OUTPUT%' then 3
			end as row_no
	,	tp.std 
	,	tp.remark 
	,	tp.param_name
	from
		tb_param tp 
	where
		group_code = 'GRP06-00921'
		and cate_name = @eqp_code
		or eqp_code = @diwater
)
select
	eqp_code
,	table_name 
,	column_name 
,	row_no
,	param_name
,	case when remark like '%이상%' then column_name + ' > ' + cast(std as varchar) else column_name + ' < ' + cast(std as varchar) end condition 
from
	cte