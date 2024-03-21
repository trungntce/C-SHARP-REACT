insert into 
	dbo.tb_errorgroup
(
	corp_id
,	fac_id
,	errorgroup_code
,	errorgroup_name
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@error_group_code
,	@errorgroup_name
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
;