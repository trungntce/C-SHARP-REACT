select 
	top 1000 
	model.BOM_ITEM_CODE as model_code
,	model.BOM_ITEM_DESCRIPTION  as model_desc
,	case 
		when use_yn.model_code is not null then 'Y'
		else 'N'
	end as insert_yn
from 
	erp_sdm_item_revision model
cross apply (
	select 
		top 1 *
	from 
		dbo.erp_sdm_standard_routing route
	where
		model.BOM_ITEM_ID = route.BOM_ITEM_ID
)route
outer apply(
	select 
		top 1 insp.model_code
	from
		tb_oper_insp_matter_4m_model insp
	where
		BOM_ITEM_CODE = insp.model_code
) use_yn
where
	model.ENABLED_FLAG 		= 'Y'
	and model.SOB_ID		= 90
	and model.ORG_ID		= 901
	and BOM_ITEM_CODE = @model_code
	and (
		len(BOM_ITEM_CODE) = 18
		or
		CHARINDEX('CUD', BOM_ITEM_CODE) > 0
		)
	and BOM_ITEM_DESCRIPTION like '%' + @model_description + '%'
	and model.BOM_ITEM_ID = (select top 1 a.BOM_ITEM_ID from erp_wip_job_entities a where a.JOB_NO = @workorder)
order by
	model.LAST_UPDATE_DATE  desc