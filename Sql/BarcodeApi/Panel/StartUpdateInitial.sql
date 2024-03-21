update
	dbo.tb_panel_4m_initial
set
	start_dt = getdate()
where
	group_key = @group_key
;