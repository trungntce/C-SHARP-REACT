select distinct
	operation_seq_no
,	operation_code
,	eqp_code
,	interlock_yn
,	recipe_change_yn
from
	dbo.tb_recipe_model_request_data a
where
	model_code = @model_code
and approve_key  = ''
union
select distinct
	operation_seq_no
,	operation_code
,	eqp_code
,	interlock_yn
,	recipe_change_yn
from
	dbo.tb_param_model_request_data
where
	model_code = @model_code
and approve_key  = ''
;