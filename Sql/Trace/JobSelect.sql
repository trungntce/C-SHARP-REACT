select
	job.JOB_NO					as workorder
,	job.JOB_STATUS_CODE			as job_status_code

,	item.ITEM_CODE				as item_code
,	item.ITEM_DESCRIPTION		as item_description
,	(select ENTRY_DESCRIPTION from erp_eapp_lookup_entry where LOOKUP_TYPE = 'ITEM_CLASS' and ENTRY_CODE = item.ITEM_CLASS_LCODE) as application1
,	(select ENTRY_DESCRIPTION from erp_eapp_lookup_entry where LOOKUP_TYPE = 'ITEM_USE' and ENTRY_CODE = item.ITEM_USE_LCODE) as application2
,	(select ENTRY_DESCRIPTION from erp_eapp_lookup_entry where LOOKUP_TYPE = 'ITEM_CODE_TYPE' and ENTRY_CODE = item.ITEM_CODE_TYPE_LCODE) as code_type

,	model.BOM_ITEM_CODE			as model_code
,	model.BOM_ITEM_DESCRIPTION	as model_description

,	job.JOB_PNL_QTY		
,	job.JOB_UOM_QTY		
,	job.UOM_CODE		
,	job.RELEASE_QTY		
,	job.ONHAND_QTY		
,	job.SCRAP_QTY		
,	job.JOB_RELEASE_DATE

,	vi.VENDOR_ID
,	vi.VENDOR_CODE
,	vi.VENDOR_FULL_NAME
,	vi.VENDOR_SHORT_NAME

,	job_oper.JOB_STATUS_CODE			as job_status
,	job_oper.ONHAND_OPERATION_SEQ_NO	as onhand_oper_seq_no

,	workorder_interlock.workorder_interlock_id
,	workorder_interlock.workorder_interlock_code
,	workorder_interlock.workorder_on_remark
,	workorder_interlock.workorder_on_update_user
,	workorder_interlock.workorder_on_user_name
,	workorder_interlock.workorder_on_dt
from
	dbo.erp_wip_job_entities job
join
	dbo.erp_wip_work_order wo
	on	job.WORK_ORDER_ID = wo.WORK_ORDER_ID
	and	job.SOB_ID = wo.SOB_ID
	and	job.ORG_ID = wo.ORG_ID
left join
	dbo.erp_oe_sales_order_header sales
	on	wo.ORDER_HEADER_ID = sales.ORDER_HEADER_ID
	and	wo.SOB_ID = sales.SOB_ID
	and wo.ORG_ID = sales.ORG_ID
left join
	dbo.erp_fi_vendor vi
	on	sales.SHIP_TO_CUST_SITE_ID = vi.VENDOR_ID
join
	dbo.erp_inv_item_master item
	on	job.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
join
	dbo.erp_sdm_item_revision model
	on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
left join
	dbo.erp_wip_job_entities_mes job_oper
	on	job.JOB_NO = job_oper.JOB_NO
outer apply
(
	select top 1
		workorder_interlock_id
	,	interlock_code		as workorder_interlock_code
	,	on_remark			as workorder_on_remark
	,	on_update_user		as workorder_on_update_user
	,	[user_name]			as workorder_on_user_name
	,	on_dt				as workorder_on_dt
	from
		dbo.tb_workorder_interlock workorder
	left join
		dbo.tb_user on_user
		on	workorder.on_update_user = on_user.[user_id]
	where
		job.JOB_NO = workorder.workorder
	and	workorder.off_dt is null
	order by
		on_dt desc -- 현재 Batch 기준으로 인터락 걸린 건 중 최신 1건
) workorder_interlock	
where 
	job.JOB_NO = @workorder
AND	job.JOB_NO = (select top 1 workorder from tb_panel_realtime where panel_id = @panel_id)
;
