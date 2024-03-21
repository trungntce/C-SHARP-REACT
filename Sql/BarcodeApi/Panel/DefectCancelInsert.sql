if(@roll_id<>'')
begin
	update
		dbo.tb_panel_defect
	set
		off_update_user = @off_update_user
	,   off_remark = @off_remark
	,	off_dt = getdate()
	where
		roll_id = @roll_id
		and on_dt = (
			select
				max(on_dt)
			from
				dbo.tb_panel_defect
			where
				roll_id = @roll_id)
end
else
begin
	update
		dbo.tb_panel_defect
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
				dbo.tb_panel_defect
			where
				panel_id = @panel_id
		)
end