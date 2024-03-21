with cte as
(
	select distinct
		spc.panel_id
	,	spc.ipqc_status
	,	spc.check_type_id
	,	spc.check_type_desc
	,	spc.check_position_id
	,	spc.check_position_desc
	,	spc.check_number_id
	,	spc.check_number_desc
	,	spc.cs_status
	,	spc.cust_min
	,	spc.cust_max
	,	spc.inner_min
	,	spc.inner_max
	,	spc.value_least
	,	spc.value_greatest
	,	spc.insp_dt
	,	spc.insp_val

	,	spc.item_key			as item_key_ng
	,	item.item_key

	,	spc.group_key			as group_key_ng
	,	item.panel_group_key	as group_key

	,	item.create_dt
	from
		dbo.tb_panel_spc spc
	join
		dbo.tb_panel_item item
		on	spc.panel_id = item.panel_id
		and	spc.item_key != item.item_key	-- 그당시 공정은 제외
		and	spc.group_key < item.panel_group_key	-- 그룹키 기준으로 이후 판넬만
	where
		item.create_dt >= @from_dt and item.create_dt < @to_dt
), cte_4m_ng as
(
	select
		row_number() over (partition by group_key order by row_key) as row_num -- group_key 로 첫번째
	,	*
	from
		dbo.tb_panel_4m
	where
		group_key in (select group_key_ng from cte)
), cte_4m as
(
	select
		row_number() over (partition by group_key order by row_key) as row_num -- group_key 로 첫번째
	,	*
	from
		dbo.tb_panel_4m
	where
		group_key in (select group_key from cte)
)
select
	cte.*

,	cte_4m_ng.eqp_code					as eqp_code_ng
,	cte_4m_ng.workorder					as workorder_ng
,	cte_4m_ng.oper_code					as oper_code_ng
,	cte_4m_ng.oper_seq_no				as oper_seq_no_ng
,	sdm_oper_ng.OPERATION_DESCRIPTION	as oper_description_ng
,	cte_4m_ng.create_dt					as create_dt_4m_ng

,	cte_4m.eqp_code						as eqp_code
,	cte_4m.workorder					as workorder
,	cte_4m.oper_code					as oper_code
,	cte_4m.oper_seq_no					as oper_seq_no
,	sdm_oper.OPERATION_DESCRIPTION		as oper_description
,	cte_4m.create_dt					as create_dt_4m

,	model_ng.BOM_ITEM_CODE				as model_code
,	model_ng.BOM_ITEM_DESCRIPTION		as model_description
from
	cte
join
	cte_4m_ng
	on	cte.group_key_ng = cte_4m_ng.group_key
	and cte_4m_ng.row_num = 1
join
	cte_4m
	on	cte.group_key = cte_4m.group_key
	and cte_4m.row_num = 1
join
	dbo.erp_wip_job_entities job_ng
	on	cte_4m_ng.workorder = job_ng.JOB_NO
join
	dbo.erp_sdm_item_revision model_ng
	on	job_ng.BOM_ITEM_ID = model_ng.BOM_ITEM_ID
join
	dbo.erp_sdm_standard_operation sdm_oper_ng
	on	cte_4m_ng.oper_code = sdm_oper_ng.OPERATION_CODE
join
	dbo.erp_sdm_standard_operation sdm_oper
	on	cte_4m.oper_code = sdm_oper.OPERATION_CODE
and cte_4m.workorder = @workorder
and	cte_4m.eqp_code = @eqp_code
and	model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
order by
	cte.create_dt desc
;
