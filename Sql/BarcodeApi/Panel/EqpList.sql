select 
	@barcode  as eqp_code
,	erp_sdm_standard_equipment.EQUIPMENT_DESCRIPTION as eqp_name
from 
	erp_sdm_standard_equipment
where 
	erp_sdm_standard_equipment.EQUIPMENT_CODE = @barcode
	and erp_sdm_standard_equipment.SOB_ID = 90
	and erp_sdm_standard_equipment.ORG_ID = 901