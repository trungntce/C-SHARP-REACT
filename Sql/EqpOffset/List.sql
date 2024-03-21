select distinct
	SSE.EQUIPMENT_CODE as eqp_code
,	SSE.EQUIPMENT_DESCRIPTION 
,	SSW.WORKCENTER_CODE
,	SSW.WORKCENTER_DESCRIPTION 
,	ext.barcode_yn
from
	dbo.erp_sdm_standard_equipment SSE
inner join 
	dbo.erp_sdm_standard_resource SRE 
  on SRE.SOB_ID = SSE.SOB_ID 
and SRE.ORG_ID = SSE.ORG_ID 
and SRE.RESOURCE_ID = SSE.RESOURCE_ID 
left outer join 
	dbo.erp_sdm_standard_workcenter SSW 
  on SSW.WORKCENTER_ID = SRE.WORKCENTER_ID
left outer join 
	dbo.tb_eqp_ext ext 
  on ext.eqp_code = SSE.EQUIPMENT_CODE 
where
	SSE.SOB_ID = 90
and	SSE.ORG_ID = 901
and	SSE.ENABLED_FLAG = 'Y'
and SRE.ENABLED_FLAG = 'Y'
and SSW.ENABLED_FLAG = 'Y'
and SSE.EQUIPMENT_CODE = @eqp_code
and ext.barcode_yn = @barcode_yn
order by EQUIPMENT_CODE 