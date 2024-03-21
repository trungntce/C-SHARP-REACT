update 
	dbo.tb_standard_time
set 
	eqp_id			= @eqp_id
,	model_id		= @model_id
,	st_val			= @st_val
,	create_dt		= getdate()
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	eqp_id			= @eqp_id
;
