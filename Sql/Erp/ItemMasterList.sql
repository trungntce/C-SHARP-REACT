select distinct
	item.INVENTORY_ITEM_ID
,	item.ITEM_CODE
,	item.ITEM_DESCRIPTION
,	item.ITEM_USE_LCODE
,	item.ITEM_CLASS_LCODE
from 
	dbo.erp_inv_item_master item
where 
	SOB_ID = 90
and	ORG_ID = 901
and	item.ITEM_CATEGORY_CODE = 'FG' 
and	item.ENABLED_FLAG = 'Y'