select 
	black.*
,	oper.OPERATION_DESCRIPTION 	as oper_name
,	eqp.EQUIPMENT_DESCRIPTION 	as eqp_name
,	item.ITEM_DESCRIPTION 		as item_name
from 
	tb_spc_8rule_blacklist	black
left join
	erp_sdm_standard_operation oper
	on black.oper_code = oper.OPERATION_CODE
left join
	erp_sdm_standard_equipment eqp
	on black.eqp_code  = eqp.EQUIPMENT_CODE
left join
	erp_inv_item_master item
	on black.item_code = item.ITEM_CODE
	and	item.ITEM_CATEGORY_CODE = 'FG' 
	and	item.ENABLED_FLAG = 'Y'
where
	1=1
	and oper_code = @oper_code
	and inspection_desc = @inspection_desc
	and eqp_code = @eqp_code
	and item_code = @item_code