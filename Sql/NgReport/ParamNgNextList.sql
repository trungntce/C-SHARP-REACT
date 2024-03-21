with cte as
(
	select distinct
		[param].param_id
	,	[param].panel_id
	,	[param].std
	,	[param].lcl
	,	[param].ucl
	,	[param].lsl
	,	[param].usl
	,	[param].eqp_min_val
	,	[param].eqp_max_val
	,	[param].eqp_avg_val
	,	[param].eqp_start_dt
	,	[param].eqp_end_dt
	,	[param].judge
	,	[param].raw_type
	,	[param].table_name
	,	[param].column_name

	,	item.item_key				as item_key_ng
	,	item.panel_group_key		as group_key_ng

	,	item_next.item_key
	,	item_next.panel_group_key	as group_key

	,	item_next.create_dt
	from
		dbo.tb_panel_param [param]
	join
		dbo.tb_panel_item item
		on	[param].item_key = item.item_key
	join
		dbo.tb_panel_item item_next
		on	[param].panel_id = item_next.panel_id
		and item.item_key != item_next.panel_group_key
		and	item.panel_group_key < item_next.panel_group_key -- 그룹키 기준으로 이후 판넬만
	where
		item_next.create_dt >= @from_dt and item.create_dt < @to_dt
	and [param].judge = 'N'
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

,	[param].param_name

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
join
	dbo.tb_param [param]
	on	cte.param_id = [param].param_id
and cte_4m.workorder = @workorder
and	cte_4m.eqp_code = @eqp_code
and	model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
order by
	create_dt desc
;
