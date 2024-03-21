insert into 
	dbo.tb_favorite
(
	corp_id
,	fac_id
,	[user_id]
,	menu_id
,	sort
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@create_user
,	@menu_id
,	9999999
,	getdate()
;