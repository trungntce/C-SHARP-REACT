select
	[param].*
,	ctq.eqp_code eqp_code_ctq
from
	dbo.tb_param_model model
join
	dbo.tb_param [param]
	on	model.group_code = param.group_code
left join
	dbo.tb_ctq ctq
	on	[param].eqp_code = ctq.eqp_code
	and	[param].table_name = ctq.table_name
	and	[param].column_name = ctq.column_name
where
	model.eqp_code = @eqp_code
and	model.model_code = @model_code
and	model.operation_seq_no = @oper_seq_no
and len([param].table_name) > 0 and len([param].column_name) > 0
;