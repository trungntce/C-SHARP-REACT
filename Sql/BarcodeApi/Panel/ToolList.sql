select 
	ITEM_CODE, ITEM_DESCRIPTION 
from 
	erp_inv_item_master
where 
	ITEM_DIVISION_CODE = 'TOOL'
	AND ITEM_CODE = @tool_code