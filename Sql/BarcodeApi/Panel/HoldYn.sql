update
	dbo.tb_panel_realtime
set
	hold_yn = @hold_yn
,	update_dt = getdate()
where
	panel_id = @panel_id
;