select
	fdc.group_key
,	fdc.item_key
,	fdc.panel_id
,	[4m].workorder
,	item.create_dt
,	[real].workorder as workorder_real
,	[real].interlock_yn
from
	dbo.tb_panel_fdc fdc
join
	dbo.tb_panel_4m [4m]
	on	fdc.group_key = [4m].group_key
join
	dbo.tb_panel_item item
	on	fdc.item_key = item.item_key
join
	dbo.tb_panel_realtime [real]
	on item.panel_id = [real].panel_id
where
	fdc.header_group_key in (select [value] from string_split(@header_group_key, ','))
;