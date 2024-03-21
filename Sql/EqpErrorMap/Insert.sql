insert into
	dbo.tb_eqp_error_map
(	corp_id,
	fac_id,
	eqp_code,
	eqp_error_code,
	error_code,
	remark,
	create_user,
	create_dt
)
select
	@corp_id
,	@fac_id
,	@eqp_code
,	@eqp_error_code
,	@error_code
,	@remark
,	@create_user
,	getdate()
;