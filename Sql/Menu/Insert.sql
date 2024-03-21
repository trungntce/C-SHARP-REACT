insert into
	dbo.tb_menu
(
	corp_id
,	fac_id
,	menu_id
,	menu_name
,	menu_type
,	parent_id
,	icon
,	use_yn
,	menu_sort
,	menu_body
,	manager
,	create_user
,	create_dt
)
values
(
	@corp_id
,	@fac_id
,	@menu_id
,	@menu_name
,	@menu_type
,	@parent_id
,	@icon
,	@use_yn
,	@menu_sort
,	@menu_body
,	@manager
,	@create_user
,	getdate()
)
;