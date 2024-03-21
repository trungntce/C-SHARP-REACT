select
	OPERATION_ID			as oper_id
,	OPERATION_CODE			as oper_code
,	OPERATION_DESCRIPTION	as oper_description
,	WORKING_UOM				as working_uom
from
	dbo.erp_sdm_standard_operation
order by 
	OPERATION_ID
;