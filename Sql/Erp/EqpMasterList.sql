select distinct
	EQUIPMENT_CODE
,	EQUIPMENT_DESCRIPTION
from
	dbo.erp_sdm_standard_equipment
where
	SOB_ID = 90
and	ORG_ID = 901
and	ENABLED_FLAG = 'Y'
order by EQUIPMENT_CODE