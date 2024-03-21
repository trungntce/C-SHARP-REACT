select
	a.menu_id
,	a.target_id
,	a.target_type
,	a.auth
,	a.create_user
,	a.create_dt
,	a.update_user
,	a.update_dt

,	g.usergroup_name
,	g.remark	as usergroup_remark

,	u.[user_name]
,	u.remark	as user_remark
,	u.nation_code as user_nation_code
from 
	dbo.tb_menu_auth a
left join
	dbo.tb_usergroup g
	on	a.corp_id = g.corp_id
	and a.fac_id = g.fac_id
	and a.target_type = 'G'
	and a.target_id = g.usergroup_id
left join
	dbo.tb_user u
	on	a.corp_id = u.corp_id
	and a.fac_id = u.fac_id
	and a.target_type = 'U'
	and a.target_id = u.[user_id]
where
	a.corp_id			= @corp_id
and	a.fac_id			= @fac_id
and	a.menu_id			= @menu_id
and a.target_id		like '%' + @target_id + '%'
and	a.target_type		= @target_type
order by
	a.create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;