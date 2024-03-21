update
	dbo.tb_panel_4m_interlock
set
	group_key = @group_key
where
	header_group_key = @header_group_key
;