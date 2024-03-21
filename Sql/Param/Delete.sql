delete from
	dbo.tb_param
where
	corp_id				= @corp_id			
and fac_id				= @fac_id			
and eqp_code			= @eqp_code
and param_id			= @param_id
and approve_key			= ''
;