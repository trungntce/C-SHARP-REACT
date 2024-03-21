insert into
	dbo.tb_error_code
(	
	corp_id
,	fac_id
,	errorgroup_code
,	error_code
,	[error_message]
,	eqp_code
,	eqp_error_code
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@errorgroup_code
,	@error_code
,	@error_message
,	@eqp_code
,	@eqp_error_code
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
;