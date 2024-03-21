insert into 
	dbo.tb_code
(
	corp_id
,	fac_id
,	codegroup_id
,	code_id
,	code_name
,	remark
,	use_yn
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	'REWORKREASON'
,	@code_id
,	@code_name
,	@remark
,	@use_yn
,	@create_user
,	getdate()
;