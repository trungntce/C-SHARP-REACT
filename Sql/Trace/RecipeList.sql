select
	*
,	ctq.eqp_code eqp_code_ctq
from
	dbo.tb_recipe_model model
join
	dbo.tb_recipe recipe
on	model.group_code = recipe.group_code
left join
	dbo.tb_ctq ctq
	on	recipe.eqp_code = ctq.eqp_code
	and	recipe.table_name = ctq.table_name
	and	recipe.column_name = ctq.column_name
where
	model.eqp_code = @eqp_code
and	model.model_code = @model_code
and	model.operation_seq_no = @oper_seq_no
and len(recipe.table_name) > 0 and len(recipe.column_name) > 0
;