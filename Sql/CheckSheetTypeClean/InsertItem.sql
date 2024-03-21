delete from dbo.tb_checksheet_item_clean
where item_code = @item_code 
	and checksheet_code = @checksheet_code
;

insert into dbo.tb_checksheet_item_clean
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
	@checksheet_code
,	@item_code
,	@item_name
,	@use_yn
,	@remark
,	@create_user
,	getdate()
,	@update_user
,	getdate()
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