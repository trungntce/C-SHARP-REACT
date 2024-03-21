if @panel_interlock_yn = 'Y'
begin

	update
		dbo.tb_panel_realtime
	set
		interlock_yn = 'N'
	from
		dbo.tb_panel_realtime [real]
	join
		dbo.tb_panel_item item
		on	[real].panel_id = item.panel_id
	join
		dbo.tb_panel_4m [4m]
		on	[4m].group_key = item.panel_group_key
	join
		dbo.tb_workorder_interlock workorder		
		on	[4m].group_key = workorder.panel_group_key
	where
		workorder.workorder = @workorder
	and	workorder.off_dt is null
	;

end

update
	dbo.tb_workorder_interlock
set
	off_remark		= @remark
,	off_update_user = @update_user
,	off_dt			= getdate()
from
	dbo.tb_workorder_interlock workorder
where
	workorder.workorder = @workorder
;
