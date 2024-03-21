if(@roll_id <> '')
begin
	update
		dbo.tb_panel_realtime
	set
		interlock_yn = @interlock_yn
	,	update_dt = getdate()
	where
		panel_id = @panel_id
end
else
begin
		update 
			dbo.tb_panel_realtime
		set 
			interlock_yn = @interlock_yn
		,	update_dt = getdate()
		where
			panel_id in (
				select
					panel_id
				from 
					tb_roll_panel_map
				where
					roll_id = @roll_id)
end