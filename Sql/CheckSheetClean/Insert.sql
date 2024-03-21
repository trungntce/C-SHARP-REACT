insert into 
	dbo.tb_checksheet_group
(
	corp_id
,	fac_id
,	[checksheet_group_code]
,	checksheet_group_name
,	workcenter_code
,	group_type
,	remark
,	use_yn
,	create_dt
,	create_user
)
select
	@corp_id
,	@fac_id
,	@checksheet_group_code
,	@checksheet_group_name
,	@workcenter_code
,	'CLEAN'
,	@remark
,	@use_yn
,	getdate()
,	@create_user
;