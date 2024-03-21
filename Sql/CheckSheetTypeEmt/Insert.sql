insert into 
	dbo.tb_checksheet
(
	corp_id
,	fac_id
,	[checksheet_group_code]
,	checksheet_code
,	parent_id
,	rev
,	valid_strt_dt
,	valid_end_dt
,	remark
,	use_yn
,	create_dt
,	create_user
)
select
	@corp_id
,	@fac_id
,	@checksheet_group_code
,	@checksheet_code
,	@parent_id
,	1
,	@valid_strt_dt
,	@valid_end_dt
,	@remark
,	@use_yn
,	getdate()
,	@create_user
;