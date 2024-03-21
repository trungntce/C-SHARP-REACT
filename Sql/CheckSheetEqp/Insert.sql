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
,	@group_type
,	@remark
,	@use_yn
,	getdate()
,	@create_user
;

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
,	@checksheet_group_code
,	null
,	1
,	getdate()
,	getdate()
,	@remark
,	@use_yn
,	getdate()
,	@create_user
;