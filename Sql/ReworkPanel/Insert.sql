insert into 
	dbo.tb_rework
(
	corp_id
,	fac_id
,	interlock_code
,	interlock_name
,	interlock_type
,	remark
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
,	@create_user
,	getdate()
;