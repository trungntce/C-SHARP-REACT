delete from dbo.tb_checksheet_group_clean where checksheet_group_code = @checksheet_group_code and item_code = @item_code;

insert into 
	dbo.tb_checksheet_group_clean
(

	checksheet_group_code
,	item_code
,	item_name
,	use_yn
,	create_dt
)
select
	@checksheet_group_code
,	@item_code
,	@item_name
,	@use_yn
,	getdate()
;