with cte as
(
	select
		panel.workorder

	,	piece.panel_id
	,	piece.piece_id
	,	piece.device_id
	,	piece.oper_seq_no
	,	piece.oper_code
	,	piece.eqp_code
	,	piece.scan_dt

	,	sdm_oper.OPERATION_DESCRIPTION as oper_description
	from
		dbo.tb_panel_piece_map piece
	join
		dbo.tb_panel_realtime panel
		on	piece.panel_id = panel.panel_id
	left join
		dbo.erp_wip_operations oper
		on	piece.workorder = oper.JOB_NO
		and	piece.oper_seq_no = oper.OPERATION_SEQ_NO
	left join
		dbo.erp_sdm_standard_operation sdm_oper
		on	oper.OPERATION_ID = sdm_oper.OPERATION_ID
	where
		panel.panel_id like '%' + @panel_id + '%'
	and	piece_id like '%' + @piece_id + '%'
	and	panel.workorder = @workorder
)
select
	cte.workorder
,	cte.panel_id
,	cte.piece_id
,	cte.device_id
,	cte.oper_seq_no
,	cte.oper_code
,	cte.oper_description
,	cte.eqp_code
,	cte.scan_dt

,	job.JOB_STATUS_CODE

,	item.ITEM_CODE				as item_code
,	item.ITEM_DESCRIPTION		as item_description

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
from
	cte
join
	dbo.erp_wip_job_entities job
	on	cte.workorder = job.JOB_NO
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
	on job.BOM_ITEM_ID = model.BOM_ITEM_ID	
option (force order)