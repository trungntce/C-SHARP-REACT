update
	dbo.tb_panel_rework
set
	refuse_update_user = @update_user
,   refuse_remark = @refuse_remark
,	refuse_dt = getdate()
where
	panel_rework_id = @panel_rework_id
;