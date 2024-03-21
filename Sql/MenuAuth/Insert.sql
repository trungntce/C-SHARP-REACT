insert into 
	dbo.tb_menu_auth
(
	corp_id
,	fac_id
,	menu_id
,	target_id
,	target_type
,	auth
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@menu_id
,	@target_id
,	@target_type
,	@auth
,	@create_user
,	getdate()
;