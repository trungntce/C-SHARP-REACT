select distinct
	operation_seq_no
,	operation_code
,	eqp_code
,	interlock_yn
from
	dbo.tb_recipe_model a
where
	model_code = @model_code
union
select distinct
	operation_seq_no
,	operation_code
,	eqp_code
,	interlock_yn
from
	dbo.tb_param_model
where
	model_code = @model_code
;