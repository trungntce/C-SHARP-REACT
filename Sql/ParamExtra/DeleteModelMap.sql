delete from
	dbo.tb_param_model_extra
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and model_code			= @model_code
and operation_seq_no	= @operation_seq_no
and eqp_code			= @eqp_code
and approve_key			= ''
;