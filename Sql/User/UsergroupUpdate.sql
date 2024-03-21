update
	dbo.tb_user
set
	usergroup_json	= @usergroup_json
,	update_user		= @update_user
,	update_dt		= getdate()
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	[user_id] = @user_id
;
