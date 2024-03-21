update
	dbo.tb_panel_realtime
set
	interlock_yn = @interlock_yn
,	update_dt = getdate()
where
	panel_id = @panel_id
;