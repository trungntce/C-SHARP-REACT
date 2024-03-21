update
	dbo.tb_panel_realtime
set
	rework_approve_yn = @rework_approve_yn
,	update_dt = getdate()
where
	panel_id = @panel_id
;