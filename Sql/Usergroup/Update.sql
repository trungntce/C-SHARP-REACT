update
	dbo.tb_usergroup
set
	usergroup_name		= @usergroup_name
,	remark			= @remark
,	update_user		= @update_user
,	update_dt		= getdate()
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	usergroup_id = @usergroup_id
;
