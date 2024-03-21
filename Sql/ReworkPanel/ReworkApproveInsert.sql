update
	dbo.tb_panel_rework
set
	approve_update_user = @update_user
,   approve_remark = @approve_remark
,	approve_dt = getdate()
where
	panel_rework_id = @panel_rework_id
;