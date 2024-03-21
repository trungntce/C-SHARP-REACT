delete from
	dbo.tb_param_model
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and model_code			= @model_code
and operation_seq_no	= @operation_seq_no
and eqp_code			= @eqp_code
and approve_key			= ''
;

insert into
	dbo.tb_param_model
(
	corp_id
,	fac_id
,	approve_key
,	model_code
,	operation_seq_no
,	operation_code
,	eqp_code
,	group_code
,	interlock_yn
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	''
,	@model_code
,	@operation_seq_no
,	@operation_code
,	@eqp_code
,	cast(@group_code as varchar)
,	@interlock_yn
,	@create_user
,	getdate()
--from
--	openjson(@param_json)
--	with
--	(
--		group_code   varchar(30) '$.GroupCode'
--	)
;