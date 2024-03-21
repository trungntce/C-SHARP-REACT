select
	[4m].*
,	sdm_oper.OPERATION_DESCRIPTION as oper_name

,	recipe_model.interlock_yn as recipe_interlock_yn
,	param_model.interlock_yn as param_interlock_yn

,	panel_cnt.*
from
	dbo.tb_panel_4m [4m]
left join
	dbo.erp_sdm_standard_operation sdm_oper
	on [4m].oper_code = sdm_oper.OPERATION_CODE
left join 
	dbo.tb_recipe_model recipe_model
	on	[4m].model_code = recipe_model.model_code
	and	[4m].oper_seq_no = recipe_model.operation_seq_no
	and	[4m].eqp_code = recipe_model.eqp_code
left join 
	dbo.tb_param_model param_model
	on	[4m].model_code = param_model.model_code
	and	[4m].oper_seq_no = param_model.operation_seq_no
	and	[4m].eqp_code = param_model.eqp_code
outer apply
(
	select
		count(*) as panel_cnt
	from
		dbo.tb_panel_item item
	where
		[4m].group_key = item.panel_group_key
) panel_cnt
where
	[4m].workorder = @workorder
order by 
	[4m].oper_seq_no
;