select
	rework.*
,	refuse_usr.[user_name] as refuse_update_user_name
,	approve_usr.[user_name] as approve_update_user_name
from
	dbo.tb_panel_interlock interlock
join
	dbo.tb_panel_rework rework
	on	interlock.panel_interlock_id = rework.panel_interlock_id
left join
	dbo.tb_user refuse_usr
	on	rework.refuse_update_user = refuse_usr.[user_id]
left join
	dbo.tb_user approve_usr
	on	rework.approve_update_user = approve_usr.[user_id]
where
	interlock.group_key = @group_key
order by
	panel_id
;
