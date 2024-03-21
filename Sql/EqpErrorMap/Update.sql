update
	dbo.tb_eqp_error_map
set
	eqp_code			= @eqp_code
,	error_code			= @error_code
,	remark				= @remark
,	update_user			= @update_user
,	update_dt			= getdate()	
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and eqp_error_code		= @eqp_error_code
;