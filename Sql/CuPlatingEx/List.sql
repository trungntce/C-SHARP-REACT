with cte_4m as
(
	select
		[4m].group_key
	,	string_agg([4m].workorder, ',')		as workorder_list
	,	string_agg(roll.roll_id, ',')		as roll_list
	,	max([4m].create_dt)					as create_dt
	,	max([4m].start_dt)					as start_dt_cmi
	,	max([4m].end_dt)					as end_dt_cmi
	,	max([4m].model_code)				as model_code
	,	max(model.BOM_ITEM_DESCRIPTION)		as model_name
	,	max(item.ITEM_CODE)					as item_code
	,	max(item.ITEM_DESCRIPTION)			as item_name
	,	[4m].eqp_code			
	from
		dbo.tb_panel_4m [4m]
	join
		dbo.erp_sdm_item_revision model
		on	[4m].model_code = model.BOM_ITEM_CODE
	join
		dbo.erp_inv_item_master item
		on	model.INVENTORY_ITEM_ID = item.INVENTORY_ITEM_ID
	left join
		dbo.tb_roll_panel_map roll
		on [4m].workorder = roll.workorder
	where
		[4m].corp_id = @corp_id
	and	[4m].fac_id = @fac_id
	and [4m].end_dt is not null
	and [4m].create_dt >= @from_dt and [4m].create_dt < @to_Dt
	and [4m].workorder = @workorder
	and	[4m].eqp_code in ('M-108-03-V001-A', 'M-108-03-V001-B')
	and [4m].eqp_code = @eqp_code
	and	item.ITEM_CODE = @item_code
	and	item.ITEM_DESCRIPTION like '%' + @item_name + '%'
	and	[4m].model_code = @model_code
	group by
		group_key, [4m].eqp_code
), cte_cu as
(
	select
		group_key
	,	panel_seq
	,	min(judge) as judge	-- N이 하나라도 있으면 N, 아니면 O
	,	min(eqp_min_val) as eqp_min_val
	,	max(eqp_max_val) as eqp_max_val
	,	avg(eqp_avg_val) as eqp_avg_val
	from
		dbo.tb_panel_param_cuplating
	where
		group_key in (select group_key from cte_4m)
	group by
		group_key, panel_seq
), cte_cu_group as
(
	select
		group_key
	,	sum(case judge when 'O' then 1 else 0 end) as ok_cnt
	,	sum(case judge when 'C' then 1 else 0 end) as chk_cnt
	,	sum(case judge when 'N' then 1 else 0 end) as ng_cnt
	,	min(eqp_min_val) as eqp_min_val
	,	max(eqp_max_val) as eqp_max_val
	,	avg(eqp_avg_val) as eqp_avg_val
	from
		cte_cu
	group by
		group_key
)
select
	[4m].*
,	cu_group.ok_cnt
,	cu_group.chk_cnt
,	cu_group.ng_cnt
,	row_number() over (order by [4m].group_key desc) as row_no
,	cu_group.eqp_min_val
,	cu_group.eqp_max_val
,	cu_group.eqp_avg_val
from
	cte_4m [4m]
join
	cte_cu_group cu_group
	on	[4m].group_key = cu_group.group_key
;