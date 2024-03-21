﻿if(@device_type ='M')
begin
	update
		dbo.tb_panel_interlock
	set
		off_remark = @off_remark
	,	off_update_user = @off_update_user
	,	off_dt = getdate()
	where
		roll_id = @rollId
		and on_dt = (
			select
				max(on_dt)
			from
				dbo.tb_panel_interlock
			where
				roll_id = @roll_id)
end
else
begin
	update
		dbo.tb_panel_interlock
	set
		off_remark = @off_remark
	,	off_update_user = @off_update_user
	,	off_dt = getdate()
	where
		panel_id = @panelId
		and on_dt = (
			select
				max(on_dt)
			from
				dbo.tb_panel_interlock
			where
				panel_id = @panel_id
		)
end