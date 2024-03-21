insert into 
	dbo.tb_code
(
	corp_id
,	fac_id
,	codegroup_id
,	code_id
,	code_name
,	start_val
,	end_val
,	rule_val
,	default_val
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@codegroup_id
,	@code_id
,	@code_name
,	@start_val
,	@end_val
,	@rule_val
,	@default_val
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
;