select
	count(*) as cnt
from
	tb_panel_4m
where
	group_key in (
		select
			panel_group_key
		from
			tb_panel_item
		where
			panel_id = @panel_id
	)
and
	workorder = (
		select top 1
			workorder
		from
			tb_panel_4m
		where
			group_key = @panel_group_key
)