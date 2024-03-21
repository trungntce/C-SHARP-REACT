select
	spc.spc_type
,	code.code_name	as spc_name
,	spc.judge
,	spc.workorder
,	spc.oper_seq_no
,	spc.oper_code
,	spc.eqp_code
,	spc.create_dt

,	item.ITEM_DESCRIPTION as item_name
,	model.BOM_ITEM_CODE	as model_code
,	model.BOM_ITEM_DESCRIPTION	as model_name

,	sdm_oper.OPERATION_DESCRIPTION as oper_name	
from
	dbo.tb_eqp_spc_judge spc
join
	dbo.erp_wip_job_entities job
	on	spc.workorder = job.JOB_NO
join
	dbo.erp_inv_item_master item
	on	job.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
join
	dbo.erp_sdm_item_revision model
	on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
join
	dbo.erp_sdm_standard_operation sdm_oper
	on	spc.oper_code = sdm_oper.OPERATION_CODE
join
	dbo.tb_code code
	on	code.codegroup_id = 'SPC_TYPE'
	and spc.spc_type = code.code_id
where
	--spc.create_dt between @from_dt and @to_dt
	spc.create_dt >= @from_dt and spc.create_dt < @to_dt
and spc_type = @spc_type
and spc.workorder = @workorder
and	spc.eqp_code = @eqp_code
and	item.ITEM_CODE = @item_code
and item.ITEM_DESCRIPTION like '%' + @item_name + '%'
and	model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
union all
select
	chem.spc_type
,	code.code_name	as spc_name
,	chem.judge
,	null as workorder
,	null as oper_seq_no
,	null as oper_code
,	chem.eqp_code
,	chem.create_dt

,	null as item_name
,	null as model_code
,	null as model_name

,	null as oper_name
from
	dbo.tb_eqp_chem_judge chem
join
	dbo.tb_code code
	on	code.codegroup_id = 'SPC_TYPE'
	and chem.spc_type = code.code_id
where
	--chem.create_dt between @from_dt and @to_dt
	chem.create_dt >= @from_dt and chem.create_dt < @to_dt
and chem.spc_type = @spc_type
and 1=2 -- @workorder
and	chem.eqp_code = @eqp_code
and	1=2 -- @item_code
and	1=2 -- @item_name
and	1=2 -- @model_code
and	1=2 -- @model_name
order by
	create_dt desc
;
