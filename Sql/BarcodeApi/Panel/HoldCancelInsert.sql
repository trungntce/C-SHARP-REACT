update
	dbo.tb_panel_hold
set
	off_update_user = @off_update_user
,   off_remark = @off_remark
,	off_dt = getdate()
where
	panel_id = @panel_id
	and on_dt = (
		select
			max(on_dt)
		from
			dbo.tb_panel_hold
		where
			panel_id = @panel_id
	)
;