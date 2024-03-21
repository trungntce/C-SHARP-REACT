update 
	tb_panel_4m
set 
	end_dt = null
where 
	group_key = @group_key
	and end_dt is not null

