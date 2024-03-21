select 
	corp_id
,	fac_id
,	[user_id]
,	[user_name]
,	nation_code
,	email
,	use_yn
,	login_dt
,	usergroup_json
from 
	dbo.tb_user
where
	[user_id] = @user_id
and [password] = hashbytes('SHA2_256', @password)
;