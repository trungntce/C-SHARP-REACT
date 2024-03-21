insert into 
	dbo.tb_eqparea
(
	corp_id
,	fac_id
,	eqpareagroup_code
,	eqparea_code
,	eqparea_name
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@eqpareagroup_code
,	dbo.fn_area_seq(@eqpareagroup_code)
,	@eqparea_name
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
;