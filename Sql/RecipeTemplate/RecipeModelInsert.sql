﻿delete from
	dbo.tb_recipe_model_request_data
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and model_code			= @model_code
and operation_seq_no	= @oper_seq_no
and eqp_code			= @eqp_code
and approve_key			= ''
;

insert into
	dbo.tb_recipe_model_request_data
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
,	recipe_change_yn
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	''
,	@model_code
,	@oper_seq_no
,	@oper_code
,	@eqp_code
,	cast(@group_code as varchar)
,	@interlock_yn
,	'Y'
,	@create_user
,	getdate()
;