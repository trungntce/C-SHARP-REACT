select distinct
   	eqp.EQUIPMENT_CODE
,   eqp.EQUIPMENT_DESCRIPTION 
,   workcenter.WORKCENTER_CODE
,   workcenter.WORKCENTER_DESCRIPTION 
from
   dbo.erp_sdm_standard_equipment eqp
inner join
	dbo.erp_sdm_standard_resource sdm_resource  
  	on 	sdm_resource.SOB_ID = eqp.SOB_ID 
	and sdm_resource.ORG_ID = eqp.ORG_ID 
	and sdm_resource.RESOURCE_ID = eqp.RESOURCE_ID 
left outer join 
   	dbo.erp_sdm_standard_workcenter workcenter
  	on workcenter.WORKCENTER_ID = sdm_resource.WORKCENTER_ID
where
   	eqp.SOB_ID = 90
	and	eqp.ORG_ID = 901
	and eqp.ENABLED_FLAG = 'Y'
	and	sdm_resource.ENABLED_FLAG = 'Y'
	and workcenter.ENABLED_FLAG = 'Y'
order by EQUIPMENT_CODE