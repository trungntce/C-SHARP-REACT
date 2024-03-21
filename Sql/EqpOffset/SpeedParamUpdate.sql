update
	dbo.tb_eqp_offset
set
	speed_param_id		= @param_id
,	update_user			= @update_user
,	update_dt			= getdate()
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and eqp_code	= @eqp_code
;