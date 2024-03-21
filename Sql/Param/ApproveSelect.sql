select
	model_code,
	approve_yn
from
	dbo.tb_param_model_approve
where
	corp_id		= @corp_id
and fac_id		= @fac_id
and model_code	= @model_code
;