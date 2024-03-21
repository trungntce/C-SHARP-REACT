select distinct
	operation_seq_no
,	operation_code
,	eqp_code
,	interlock_yn
from
	dbo.tb_param_model_extra
where
	model_code = @model_code
;