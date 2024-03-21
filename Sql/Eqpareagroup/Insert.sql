insert into 
	dbo.tb_eqpareagroup
(
	corp_id
,	fac_id
,	eqp_code
,	eqpareagroup_code
,	eqpareagroup_name
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
,	usergroup_id
)
select
	@corp_id
,	@fac_id
,	@eqp_code
,	dbo.fn_areagroup_seq(@eqp_code)
,	@eqpareagroup_name
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
,	@usergroup_id
;