select 
	USER_ID
,	USER_NO
,	DESCRIPTION
from 
	erp_eapp_user push_type 
where 
	push_type.SOB_ID = 90 
and 
	push_type.ORG_ID = 901
and
	ENABLED_FLAG = 'Y'
order by
	USER_NO
;