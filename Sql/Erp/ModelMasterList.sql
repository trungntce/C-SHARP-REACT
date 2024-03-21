select distinct
    model.BOM_ITEM_ID           as model_id
,   model.BOM_ITEM_CODE         as model_code
,   model.BOM_ITEM_DESCRIPTION  as model_description
from 
    dbo.erp_inv_item_master item
join
    dbo.erp_sdm_item_revision model 
    on  item.SOB_ID = model.SOB_ID
    and item.ORG_ID = model.ORG_ID
    and item.INVENTORY_ITEM_ID = model.INVENTORY_ITEM_ID 
where 
	item.SOB_ID = 90
and	item.ORG_ID = 901
and item.ITEM_CATEGORY_CODE in (select [value] from string_split(@item_category_code, ','))
and item.ENABLED_FLAG = 'Y'
and item.INVENTORY_ITEM_CODE = @item_code
and model.ENABLED_FLAG = 'Y'
and model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_description + '%'
order by
    model.BOM_ITEM_CODE
;