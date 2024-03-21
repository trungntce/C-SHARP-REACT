select 
	PUSH_TYPE
,	PUSH_MODULE_LCODE
,	PUSH_DESCRIPTION 
,	PUSH_TYPE_ID
from 
	erp_eapp_mobile_push_type push_type 
where 
	push_type.SOB_ID = 90 
and 
	push_type.ORG_ID = 901
;