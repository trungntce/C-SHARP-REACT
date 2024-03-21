update
	dbo.tb_panel_4m
set
	start_dt = getdate()
where
	group_key = @group_key
;