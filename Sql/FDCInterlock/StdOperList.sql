with cte as
(
	select
		'O' as fdc_type
	,	routing.OPERATION_SEQ_NO		as oper_seq_no
	,	sdm_oper.OPERATION_CODE			as oper_code
	,	sdm_oper.OPERATION_DESCRIPTION	as oper_name
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
	and model.BOM_ITEM_CODE = @model_code
), cte_code as
(
	select
		cte.*

	,	code.rule_val as oper_type

	,	case 
			when code.rule_val = 'AOI' then aoi_code.defect_type
			when code.rule_val = 'BBT' then bbt_code.defect_type
		end as defect_type
	,	case 
			when code.rule_val = 'AOI' then aoi_code.defect_name
			when code.rule_val = 'BBT' then bbt_code.defect_name
		end as defect_name
	,	case 
			when code.rule_val = 'AOI' then aoi_code.sort
			when code.rule_val = 'BBT' then bbt_code.sort
		end as sort
	from
		cte
	join
		dbo.tb_code code
		on	cte.oper_code = code.code_id
	outer apply
	(
		select
			cast(null as varchar(30))	as defect_type
		,	'All'						as defect_name
		,	'0' as sort
		union all
		select
			aoi_code_inner.code_id
		,	aoi_code_inner.code_name
		,	sort
		from
			dbo.tb_code aoi_code_inner
		where
			corp_id = @corp_id
		and fac_id = @fac_id
		and	aoi_code_inner.codegroup_id = 'VRS_NG_CODE'
		and	aoi_code_inner.code_id <= 23
		and	code.rule_val = 'AOI'
	) aoi_code
	outer apply
	(
		select
			cast(null as varchar(30))	as defect_type
		,	'All'						as defect_name
		,	'0' as sort
		union all
		select
			bbt_code_inner.rule_val
		,	max(bbt_code_inner.code_name) as code_name
		,	max(sort) as sort
		from
			dbo.tb_code bbt_code_inner
		where
			corp_id = @corp_id
		and fac_id = @fac_id
		and	bbt_code_inner.codegroup_id = 'BBT_DEFECT_MPD'
		and	code.rule_val = 'BBT'
		group by
			bbt_code_inner.rule_val
	) bbt_code
	where
		code.codegroup_id = 'FDC_OPER'
)
select
	cte_code.*

,	rate.defect_rate
,	rate.remark
,	rate.layer
,	case when rate.table_row_no is not null then 1 else 0 end as setted
from
	cte_code
left join
	dbo.tb_fdc_defect_rate rate
	on	rate.model_code = @model_code
	and	cte_code.oper_code = rate.oper_code
	and	cte_code.fdc_type = rate.fdc_type
	and 
	(
		(cte_code.defect_type is null and rate.defect_type is null)
		or
		cte_code.defect_type = rate.defect_type
	)
order by 
	cte_code.oper_seq_no, cte_code.sort
;