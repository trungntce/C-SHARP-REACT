insert into
	dbo.tb_emapping_layout
(
	corp_id
,	fac_id
,	model_code
,	pcs_per_h
,	pcs_per_v
,	pcs_json
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@model_code
,	@pcs_per_h
,	@pcs_per_v
,	@pcs_json
,	@remark
,	@create_user
,	getdate()
;