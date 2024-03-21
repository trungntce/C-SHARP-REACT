delete from 
	dbo.tb_user
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and [user_id]		= @user_id
;
