delete from dbo.tb_checksheet_item where checksheet_item_code = @checksheet_item_code and eqp_code = @eqp_code;

insert into 
	dbo.tb_checksheet_item
(
	checksheet_code
,	checksheet_item_code
,	eqp_code
,	checksheet_type_name
,	daily_check_type
,   daily_check_date
,   check_freq_num
,	ord
,	exchg_period
,	standard_val
,	min_val
,	max_val
,	method
,	inspect_point
,	input_type
,	use_yn
,	remark
,	valid_strt_dt
,	create_dt
,   img_path
,   img_nm
)
select
	@checksheet_code
,	@checksheet_item_code
,	@eqp_code
,	@checksheet_type_name
,	@daily_check_type
,   @daily_check_date
,	@check_freq_num
,	@ord
,	@exchg_period
,	@standard_val
,	@min_val
,	@max_val
,	@method
,	@inspect_point
,	@input_type
,	@use_yn
,	@remark
,	null
,	getdate()
,   @img_path
,   @img_nm
;

update
	dbo.tb_checksheet
set
	rev = rev +1
,	update_dt			= getdate()	
,	update_user			= @update_user
where
	checksheet_code			= @checksheet_code
;