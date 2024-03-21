insert into
	dbo.tb_user
(
	corp_id
,	fac_id
,	[user_id]
,	[user_name]
,	[password]
,	nation_code
,	email
,	use_yn
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@user_id
,	@user_name
,	hashbytes('SHA2_256', @password)
,	@nation_code
,	@email
,	@use_yn
,	@remark
,	@create_user
,	getdate()
;