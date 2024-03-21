select
	agg.panel_interlock_id as id
,	item.panel_id
,	item.item_key
,	item.create_dt

,	item.recipe_judge
,	item.param_judge
,	item.spc_judge
,	item.qtime_lock
,	item.chem_judge

,	[real].workorder as workorder_real
,	[real].interlock_yn
from
	dbo.tb_panel_interlock agg
join
	dbo.tb_panel_item item
	on	agg.item_key = item.item_key
join
	dbo.tb_panel_realtime [real]
	on item.panel_id = [real].panel_id
where
	agg.header_group_key = @header_group_key
order by
	panel_id