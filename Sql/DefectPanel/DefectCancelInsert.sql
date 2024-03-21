update
	dbo.tb_panel_defect
set
	off_update_user = @update_user
,   off_remark = @off_remark
,	off_dt = getdate()
where
	panel_defect_id = @panel_defect_id
;
