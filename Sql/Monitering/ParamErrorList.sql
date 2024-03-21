with cte_4m as
(
	select
		[param].*
	from
		dbo.tb_panel_4m_param_error [param]
	where
		[param].create_dt >= @from_dt and [param].create_dt < dateadd(dd, 1, cast(@to_dt as date))
	and	[param].workorder = @workorder
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
)
select
	*
,	'PV' as gubun
from
	cte
order by
	create_dt desc, workorder, oper_seq_no, param_id
;


