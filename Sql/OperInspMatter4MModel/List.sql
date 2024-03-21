select distinct 
	SIR.BOM_ITEM_CODE as model_code
,	SIR.BOM_ITEM_DESCRIPTION as model_desc
,	SSR.OPERATION_SEQ_NO as oper_seq_no
,	SSO.OPERATION_CODE	as oper_code
,	SSO.OPERATION_DESCRIPTION	as oper_desc	
,	SSW.WORKCENTER_CODE	as workcenter_code
,	SSW.WORKCENTER_DESCRIPTION as workcenter_desc
,	concat_ws('::',SSO.OPERATION_DESCRIPTION,SSO_tl.OPERATION_DESCRIPTION,'') as tran_lang
,	isnull(oper_model.material_yn,isnull(oper_insp.material_yn,'N')) as material_yn
,	isnull(oper_model.tool_yn, isnull(oper_insp.tool_yn,'N')) as tool_yn
,	isnull(oper_model.worker_yn, isnull(oper_insp.worker_yn,'N')) as worker_yn
,	isnull(oper_model.sampling_yn,isnull(oper_insp.sampling_yn, 'N')) as sampling_yn
,	isnull(oper_model.total_insp_yn, isnull(oper_insp.total_insp_yn,'N')) as total_insp_yn
,	isnull(oper_model.spc_yn, isnull(oper_insp.spc_yn,'N')) as spc_yn
,	isnull(oper_model.qtime_yn, isnull(oper_insp.qtime_yn,'N')) as qtime_yn
,	isnull(oper_model.chem_yn, isnull(oper_insp.chem_yn,'N')) as chem_yn
,	isnull(oper_model.recipe_yn, isnull(oper_insp.recipe_yn,'N')) as recipe_yn
,	isnull(oper_model.param_yn, isnull(oper_insp.param_yn,'N')) as param_yn
,	isnull(oper_model.panel_yn, isnull(oper_insp.panel_yn,'N')) as panel_yn
from 
	dbo.erp_sdm_item_revision SIR 
join
	dbo.erp_sdm_standard_routing    SSR 
	on SIR.BOM_ITEM_ID = SSR.BOM_ITEM_ID
join 
	dbo.erp_sdm_standard_operation  SSO 
	on SSR.OPERATION_ID = SSO.OPERATION_ID
left join 
	dbo.erp_sdm_routing_wip_info    SWC 
	on SSR.STD_ROUTING_ID = SWC.STD_ROUTING_ID
left join 
	dbo.erp_sdm_standard_resource   SRE 
	on SWC.WIP_RESOURCE_CODE = SRE.RESOURCE_CODE
left join 
	dbo.erp_sdm_standard_workcenter SSW 
	on SRE.WORKCENTER_ID = SSW.WORKCENTER_ID
left join 
	dbo.erp_sdm_operation_resource_map MAP 
	on SSO.OPERATION_ID = MAP.OPERATION_ID
left join 
	dbo.erp_sdm_standard_operation_tl  SSO_tl 
	on SSO.OPERATION_ID = SSO_tl.OPERATION_ID
left join
	dbo.tb_oper_insp_matter_4m_model oper_model
	on oper_model.model_code = SIR.BOM_ITEM_CODE
	and oper_model.oper_seq_no = SSR.OPERATION_SEQ_NO
	and oper_model.oper_code = SSO.OPERATION_CODE
left join
	dbo.tb_oper_insp_matter_4m oper_insp
	on oper_insp.oper_code = SSO.OPERATION_CODE
where
	SIR.SOB_ID				= 90
	and SIR.ORG_ID			= 901
	and SIR.ENABLED_FLAG	= 'Y'
	and SSO.ENABLED_FLAG	= 'Y'
	and SRE.ENABLED_FLAG	= 'Y'
	and SSW.ENABLED_FLAG	= 'Y'
	and MAP.SOB_ID = 90
	and MAP.ORG_ID = 901
	and SIR.BOM_ITEM_CODE = @model_code