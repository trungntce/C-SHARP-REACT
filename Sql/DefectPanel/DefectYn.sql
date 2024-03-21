update
	dbo.tb_panel_realtime
set
	defect_yn = @defect_yn
,	update_dt = getdate()
where
	panel_id = @panel_id
;
