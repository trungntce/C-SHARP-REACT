insert into 
	dbo.tb_defectgroup
(
	corp_id
,	fac_id
,	defectgroup_code
,	defectgroup_name
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@defect_group_code
,	@defectgroup_name
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
;