update 
	tb_roll_panel_map
set 
	roll_id = @child_id
where
	roll_id = @parent_id
	and panel_id >= @from_panel_id
	and panel_id <= @to_panel_id
;