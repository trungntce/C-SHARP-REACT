select 
	isnull(ATTRIBUTE_E, 'null') as ip_address 
from 
	erp_sdm_standard_equipment esse
where 
	esse.EQUIPMENT_CODE = @eqp_code
	and	esse.SOB_ID = 90
	and esse.ORG_ID = 901