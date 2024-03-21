insert into
	dbo.tb_param_model_approve
(
	corp_id,
	fac_id,
	model_code,
	approve_yn,
	create_user,
	create_dt
)
select 
	@corp_id
,	@fac_id
,	@model_code
,	'N'
,	@create_user
,	getdate()
;