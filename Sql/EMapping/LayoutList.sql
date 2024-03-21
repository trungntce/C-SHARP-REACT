select
	layout.model_code
,	model.BOM_ITEM_DESCRIPTION as model_name

,	item.ITEM_CODE as item_code
,	item.ITEM_DESCRIPTION as item_name

,	layout.pcs_per_h
,	layout.pcs_per_v
,	layout.pcs_json
,	layout.remark
,	layout.create_user
,	create_user.[user_name] as create_user_name
,	layout.create_dt
,	layout.update_user
,	layout.update_dt

,	count(*) over() as total_count
from
	dbo.tb_emapping_layout layout
join
	dbo.erp_sdm_item_revision model
	on	layout.model_code = model.BOM_ITEM_CODE
join
	dbo.erp_inv_item_master item
	on	model.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
left join
	dbo.tb_user create_user
	on	layout.create_user = create_user.[user_id]
where
	layout.corp_id = @corp_id
and	layout.fac_id = @fac_id
and	layout.model_code = @model_code
and	item.ITEM_CODE = @item_code
and	layout.remark like '%' + @remark + '%'
order by
	create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;