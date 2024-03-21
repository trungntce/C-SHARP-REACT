insert into 
	dbo.tb_standard_time
(
	corp_id
,	fac_id
,	eqp_id
,	model_id
,	st_val
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@eqp_id
,	@model_id
,	@st_val
,	getdate()
;