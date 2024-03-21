select
	WORKCENTER_ID
	, WORKCENTER_CODE
	, WORKCENTER_DESCRIPTION
from
	dbo.erp_sdm_standard_workcenter
where 
	SOB_ID = 90
	and ORG_ID = 901
order by 
	WORKCENTER_ID 
;