update
	dbo.tb_panel_rework
set
	approve_update_user = @approve_update_user
,   approve_remark = @approve_remark
,	approve_dt = getdate()
where
	panel_id = @panel_id
	and put_dt = (
		select
			max(put_dt)
		from
			dbo.tb_panel_rework
		where
			panel_id = @panel_id
	)
;