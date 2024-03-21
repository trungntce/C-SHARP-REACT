update
	dbo.tb_panel_rework
set
	refuse_update_user = @refuse_update_user
,   refuse_remark = @refuse_remark
,	refuse_dt = getdate()
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