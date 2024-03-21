insert into
	dbo.tb_defect
(
	corp_id
,	fac_id
,	defectgroup_code
,	defect_code
,	defect_name
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@defectgroup_code
,	@defect_code
,	@defect_name
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
;