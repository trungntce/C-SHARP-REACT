select 
    VENDOR_ID
,   VENDOR_CODE
,   VENDOR_FULL_NAME 
,   VENDOR_SHORT_NAME 
from
    dbo.erp_fi_vendor
where 
	SOB_ID = 90
and	ORG_ID = 901
and CUSTOMER_FLAG = 'Y'
order by
    VENDOR_SHORT_NAME 
