select 
	[user_id]
,	[user_name]
,	nation_code
,	email
,	use_yn
,	remark
,	create_user
,	create_dt
,	update_user
,	update_dt
,	login_dt
,	usergroup_json

,	count(*) over() as total_count
from 
	dbo.tb_user
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	[user_id] = @user_id
and [user_name] like '%' + @user_name + '%'
and nation_code = @nation_code
and email like '%' + @email + '%'
and use_yn = @use_yn
and	remark like '%' + @remark + '%'
order by
	create_dt desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;