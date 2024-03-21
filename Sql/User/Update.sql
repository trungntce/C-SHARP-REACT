update
	dbo.tb_user
set
	[user_name]		= @user_name
,	[password]		= 
	case 
		when isnull(@password, '') = '' then [password] 
		else hashbytes('SHA2_256', @password) 
	end
,	nation_code		= @nation_code
,	email			= @email
,	use_yn			= isnull(nullif(@use_yn, 0x00), use_yn)
,	remark			= isnull(nullif(@remark, ''), remark)
,	update_user		= @update_user
,	update_dt		= getdate()
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	[user_id] = @user_id
;
