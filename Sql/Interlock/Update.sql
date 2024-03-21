update 
	dbo.tb_interlock
set 
	interlock_code		= @interlock_code
,	interlock_name		= @interlock_name
,	interlock_type		= @interlock_type
,	remark				= @remark
,	use_yn				= @use_yn
,	update_user			= @update_user
,	update_dt			= getdate()
where 
	corp_id			 = @corp_id
and	fac_id			 = @fac_id
and	interlock_code	 = @interlock_code
;
