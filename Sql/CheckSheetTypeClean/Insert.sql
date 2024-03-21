insert into 
	dbo.tb_checksheet
(
	corp_id
,	fac_id
,	checksheet_group_code
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

insert into 
	dbo.tb_checksheet_item_clean
(
	checksheet_code
,	item_code
,	item_name
,	use_yn
,	remark
,   create_user
,	create_dt
,	update_user
,	update_dt
)
select 
	@checksheet_code as checksheet_code,
	item_code,
	item_name,
	use_yn,
	remark,
	@create_user,
	getdate(),
	@update_user,
	getdate()
from dbo.tb_checksheet_group_clean
where checksheet_group_code = @checksheet_group_code
	
;