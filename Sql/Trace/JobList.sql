with cte as
(
	select distinct
		workorder
	from
		dbo.tb_panel_4m
	where
		create_dt >= @from_dt and create_dt < @to_dt
	and	workorder like '%' + @workorder + '%'
	and workorder = @lot
	and	workorder = (select workorder from tb_panel_realtime where panel_id = @panel_id)
), cte2 as
(
select
	cte.workorder
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

,	job.CREATION_DATE
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
where 1=1
and	item.ITEM_CODE = @item_code
and item.ITEM_DESCRIPTION like '%' + @item_name + '%'
and	model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
and	vi.VENDOR_CODE = @vendor_code
), cte_real as
(
	select
		a.workorder
	,	count(*) as panel_cnt
	from
		dbo.tb_panel_realtime a
	join
		cte2
		on	a.workorder = cte2.workorder
	group by
		a.workorder
)
select
	cte2.*
,	cte_real.panel_cnt
from
	cte2
left join
	cte_real
	on	cte2.workorder = cte_real.workorder
where 1=1
and	cte_real.panel_cnt > @panel_cnt
order by 
	cte2.CREATION_DATE desc
option (force order)
;
