with cte as
(
	select
		routing.OPERATION_SEQ_NO		as oper_seq_no
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
), cte_aoi as
(
	select -- AOI 頂類+諼類
		'P' as fdc_type
	,	aoi.oper_seq_no
	,	aoi.oper_code
	,	aoi.oper_name

	,	aoi_plus.oper_seq_no	as plus_oper_seq_no
	,	aoi_plus.oper_code		as plus_oper_code
	,	aoi_plus.oper_name		as plus_oper_name
	from
		cte aoi
	cross apply
		cte aoi_plus
	where
		aoi.oper_code = 'E05010'
	and	aoi_plus.oper_code = 'E05040'
	union all
	select -- AOI
		'G' as fdc_type
	,	aoi.oper_seq_no
	,	aoi.oper_code
	,	aoi.oper_name

	,	null
	,	null
	,	null
	from
		cte aoi
	where
		aoi.oper_code in (select code_id from dbo.tb_code where codegroup_id = 'FDC_OPER_GAP_AOI')
), cte_union as
(
	select
		cte_aoi.*

	,	cte_bbt.oper_seq_no	as to_oper_seq_no
	,	cte_bbt.oper_code	as to_oper_code
	,	cte_bbt.oper_name	as to_oper_name
	from
		cte_aoi
	cross apply
	(
		select
			*
		from
			cte
		where
			oper_code in (select code_id from dbo.tb_code where codegroup_id = 'FDC_OPER_GAP_BBT')
	) cte_bbt
)
select
	cte_union.*

,	detail.detail_type

,	rate.defect_rate
,	rate.remark
from
	cte_union
cross apply
(
	select null as detail_type
	union all
	select 'O'
	union all
	select 'S'
) detail
left join
	dbo.tb_fdc_defect_rate rate
	on	rate.model_code = @model_code
	AND	cte_union.fdc_type = rate.fdc_type
	and	cte_union.oper_code = rate.oper_code
	and	(cte_union.plus_oper_code is null or cte_union.plus_oper_code = rate.plus_oper_code) -- aoi頂類+諼類虜 等檜攪 氈擠
	and	cte_union.to_oper_code = rate.to_oper_code
	and	
	(
		(detail.detail_type is null and rate.detail_type is null)
		or
		detail.detail_type = rate.detail_type
	)
order by 
	cte_union.oper_seq_no
;