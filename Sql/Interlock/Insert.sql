insert into 
	dbo.tb_interlock
(
	corp_id
,	fac_id
,	interlock_code
,	interlock_name
,	interlock_type
,	remark
,	use_yn
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@interlock_code
,	@interlock_name
,	@interlock_type
,	@remark
,	@use_yn
,	@create_user
,	getdate()
;