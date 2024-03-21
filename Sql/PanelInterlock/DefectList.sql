select
	defect.*
,	usr.[user_name] as off_update_user_name
from
	dbo.tb_panel_interlock interlock
join
	dbo.tb_panel_defect defect
	on	interlock.panel_interlock_id = defect.panel_interlock_id
left join
	dbo.tb_user usr
	on	defect.off_update_user = usr.[user_id]
where
	interlock.group_key = @group_key
order by
	panel_id
;