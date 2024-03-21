
with cte as (
	select 
		count(*)				as cnt 
	,	model.BOM_ITEM_CODE		as model_code
	from 	
		dbo.erp_sdm_item_revision model 
	join 
		dbo.erp_sdm_standard_routing routing 
		on	routing.BOM_ITEM_ID = model.BOM_ITEM_ID
	join
		dbo.erp_sdm_standard_operation sdm_oper
		on	routing.OPERATION_ID = sdm_oper.OPERATION_ID
	where
		model.SOB_ID = 90
	and model.ORG_ID = 901
	and model.ENABLED_FLAG = 'Y'
	and sdm_oper.ENABLED_FLAG = 'Y'
	and sdm_oper.OPERATION_CODE in (select code_id from dbo.tb_code where codegroup_id = 'FDC_OPER')
	and model.BOM_ITEM_CODE = @model_code
	group by model.BOM_ITEM_CODE
)
select distinct
    model.BOM_ITEM_ID				as model_id
,   model.BOM_ITEM_CODE				as model_code
,   model.BOM_ITEM_DESCRIPTION		as model_name
,	isnull(defect.setted_yn, 'N')	as setted_yn
,	defect.create_user
,	[user].[user_name]				as create_user_name
,	case
		when cte.cnt = 0 or cte.cnt is NULL then 'N'
		else 'Y'
	end								as fdc_oper_yn
,	defect.create_dt
from 
    dbo.erp_inv_item_master item
join
    dbo.erp_sdm_item_revision model 
    on  item.SOB_ID = model.SOB_ID
    and item.ORG_ID = model.ORG_ID
    and item.INVENTORY_ITEM_ID = model.INVENTORY_ITEM_ID 
outer apply
(
	select top 1
		'Y' as setted_yn
	,	defect_rate.create_user
	,	defect_rate.create_dt
	from
		dbo.tb_fdc_defect_rate defect_rate
	where
		corp_id = @corp_id
	and	fac_id = @fac_id
	and	model.BOM_ITEM_CODE = defect_rate.model_code
) defect
left join
	dbo.tb_user [user]
	on	defect.create_user = [user].[user_id]
left join
	cte
	on	model.BOM_ITEM_CODE = cte.model_code
where 
	item.SOB_ID = 90
and	item.ORG_ID = 901
and item.ITEM_CATEGORY_CODE = @item_category_code
and item.ENABLED_FLAG = 'Y'
and item.ITEM_CODE = @item_code
and model.ENABLED_FLAG = 'Y'
and model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
and isnull(defect.setted_yn, 'N') = @setted_yn
order by
    model.BOM_ITEM_CODE
;