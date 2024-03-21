insert into
	dbo.tb_usergroup
(
	corp_id
,	fac_id
,	usergroup_id
,	usergroup_name
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@usergroup_id
,	@usergroup_name
,	@remark
,	@create_user
,	getdate()
;