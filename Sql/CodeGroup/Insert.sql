insert into 
	dbo.tb_codegroup
(
	corp_id
,	fac_id
,	codegroup_id
,	codegroup_name
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@code_group_id
,	@codegroup_name
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
;