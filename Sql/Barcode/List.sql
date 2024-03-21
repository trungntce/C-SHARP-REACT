with cte_item as
(
	select
		item.*
	from
		dbo.tb_panel_item item
	where
		item.scan_dt >= @from_dt and item.scan_dt < @to_dt
	and eqp_code = @eqp_code
), cte_4m as
(
    select
        row_number() over (partition by group_key order by row_key) as row_num -- group_key 로 첫번째
    ,   [4m].*
		
	,	job.JOB_STATUS_CODE				as job_status_code
	,	job.CREATION_DATE				as creation_date

	,	item.ITEM_CODE					as item_code
	,	item.ITEM_DESCRIPTION			as item_description

	--,	model.BOM_ITEM_CODE				as model_code
	,	model.BOM_ITEM_DESCRIPTION		as model_description

	--,	vi.VENDOR_CODE					as vendor_code
	--,	vi.VENDOR_SHORT_NAME			as vendor_short_name
	--,	vi.VENDOR_FULL_NAME				as vendor_full_name

	,	sdm_oper.OPERATION_DESCRIPTION	as oper_description
    from
        dbo.tb_panel_4m [4m]
	join
		dbo.erp_wip_job_entities job
		on	[4m].workorder = job.JOB_NO
	join
		dbo.erp_wip_work_order wo
		on	job.WORK_ORDER_ID = wo.WORK_ORDER_ID
		and	job.SOB_ID = wo.SOB_ID
		and	job.ORG_ID = wo.ORG_ID
--	join
--		dbo.erp_oe_sales_order_header sales
--		on	wo.ORDER_HEADER_ID = sales.ORDER_HEADER_ID
--		and	wo.SOB_ID = sales.SOB_ID
--		and wo.ORG_ID = sales.ORG_ID
--	join
--		dbo.erp_fi_vendor vi
--		on	sales.SHIP_TO_CUST_SITE_ID = vi.VENDOR_ID
	join
		dbo.erp_wip_operations oper
		on	job.JOB_ID = oper.JOB_ID
		and [4m].oper_seq_no = oper.OPERATION_SEQ_NO
	join
		dbo.erp_sdm_standard_operation sdm_oper
		on oper.OPERATION_ID = sdm_oper.OPERATION_ID
	join
		dbo.erp_inv_item_master item
		on	job.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
	join
		dbo.erp_sdm_item_revision model
		on job.BOM_ITEM_ID = model.BOM_ITEM_ID
	where
		[4m].group_key in (select group_key from cte_item)
), cte as
(
	select
		cte_item.*

	,	cte_4m.job_status_code
	,	cte_4m.creation_date

	,	cte_4m.item_code
	,	cte_4m.item_description

	,	cte_4m.model_code
	,	cte_4m.model_description

	,	cte_4m.oper_description
	,	cte_4m.workorder
	,	cte_4m.oper_seq_no
	from
		cte_item
	left join 
		cte_4m
		on	cte_item.panel_group_key = cte_4m.group_key
		and	cte_4m.row_num = 1
	where
		cte_item.corp_id = @corp_Id
	and cte_item.fac_id = @fac_id
	and cte_item.panel_id like '%' + @panel_id + '%'
	and	cte_4m.workorder like '%' +  @workorder + '%'
	and	cte_4m.item_code = @item_code
	and	cte_4m.item_description like '%' + @item_name + '%'
	and	cte_4m.model_code = @model_code
	and	cte_4m.model_description like '%' + @model_name + '%'
	and	cte_4m.vendor_code = @vendor_code
)
select
	*
from
	cte
order by 
	cte.scan_dt desc
;