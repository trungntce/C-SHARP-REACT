with cte_4m as
(
	select
		[param].*
	from
		dbo.tb_panel_4m_param [param]
	join
		dbo.tb_panel_4m [4m]
		on	[param].panel_row_key = [4m].row_key
		and	[param].panel_group_key = [4m].group_key
	where
		[4m].create_dt >= @from_dt and [4m].create_dt < @to_dt
	and	[param].workorder = @workorder
	and [4m].group_key in (select panel_group_key from dbo.tb_panel_item where panel_id = @panel_id and create_dt >= @from_dt and create_dt < @to_dt)
	and [param].judge = @judge
), cte as 
(
	select
		cte_4m.*

	,	job.JOB_STATUS_CODE				as job_status_code
	,	job.CREATION_DATE				as creation_date

	,	item.ITEM_CODE					as item_code
	,	item.ITEM_DESCRIPTION			as item_description

	,	model.BOM_ITEM_CODE				as model_code
	,	model.BOM_ITEM_DESCRIPTION		as model_description

	,	sdm_oper.OPERATION_CODE			as oper_code
	,	sdm_oper.OPERATION_DESCRIPTION	as oper_description
	,	concat_ws('::', sdm_oper.OPERATION_DESCRIPTION, sdm_oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_name
	from
		cte_4m
	join
		dbo.erp_wip_job_entities job
		on	cte_4m.workorder = job.JOB_NO
	join
		dbo.erp_wip_operations oper
		on	job.JOB_ID = oper.JOB_ID
		and cte_4m.oper_seq_no = oper.OPERATION_SEQ_NO
	join
		dbo.erp_sdm_standard_operation sdm_oper
		on oper.OPERATION_ID = sdm_oper.OPERATION_ID
	join
		dbo.erp_sdm_standard_operation_tl sdm_oper_tl
		on sdm_oper.OPERATION_ID = sdm_oper_tl.OPERATION_ID
	join
		dbo.erp_inv_item_master item
		on	job.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
	join
		dbo.erp_sdm_item_revision model
		on job.BOM_ITEM_ID = model.BOM_ITEM_ID
	where 1=1
	and	item.ITEM_CODE = @item_code
	and item.ITEM_DESCRIPTION like '%' + @item_name + '%'
	and	model.BOM_ITEM_CODE = @model_code
	and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
	and	vi.VENDOR_CODE = @vendor_code
)
select
	cte.*
,	[param].param_name
from
	cte
join
	dbo.tb_param [param]
	on	cte.param_id = [param].param_id
order by
	creation_date desc, workorder, oper_seq_no, param_id
;


