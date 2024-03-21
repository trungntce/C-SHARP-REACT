update
	dbo.tb_error_code
set
	[error_message]		= @error_message
,	eqp_code			= @eqp_code
,	eqp_error_code		= @eqp_error_code
,	use_yn				= @use_yn
,	sort				= @sort
,	remark				= @remark
,	update_user			= @update_user
,	update_dt			= getdate()	
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and error_code			= @error_code
;