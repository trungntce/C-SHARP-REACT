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
	,	item.item_key
	,	item.panel_group_key as group_key
	from
		dbo.tb_panel_param [param]
	join
		dbo.tb_panel_item item
		on	[param].item_key = item.item_key
	where
		item.create_dt >= @from_dt and item.create_dt < @to_dt
	and [param].judge = 'N'
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
	case when ctq.eqp_code is not null then 'Y' else null end as ctq_yn
,	cte.*

,	[param].param_name

,	cte_4m.eqp_code					as eqp_code
,	cte_4m.workorder				as workorder
,	cte_4m.oper_code				as oper_code
,	cte_4m.oper_seq_no				as oper_seq_no
,	sdm_oper.OPERATION_DESCRIPTION	as oper_description
,	cte_4m.create_dt				as create_dt_4m

,	model.BOM_ITEM_CODE				as model_code
,	model.BOM_ITEM_DESCRIPTION		as model_description
from
	cte
join
	cte_4m
	on	cte.group_key = cte_4m.group_key
	and cte_4m.row_num = 1
join
	dbo.erp_wip_job_entities job
	on	cte_4m.workorder = job.JOB_NO
join
	dbo.erp_sdm_item_revision model
	on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
join
	dbo.erp_sdm_standard_operation sdm_oper
	on	cte_4m.oper_code = sdm_oper.OPERATION_CODE
join
	dbo.tb_param [param]
	on	cte.param_id = [param].param_id
left join 
		dbo.tb_ctq ctq
		on	cte.table_name = ctq.table_name
		and	cte.column_name = ctq.column_name
where 1=1
and	cte_4m.workorder = @workorder
and	cte_4m.eqp_code = @eqp_code
and	model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
order by
	create_dt_4m desc
;