delete from dbo.tb_param_model_request_data
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and model_code			= @model_code
and approve_key = ''
;

delete from dbo.tb_recipe_model_request_data
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and model_code			= @model_code
and approve_key = ''
;

delete from
	dbo.tb_recipe_approve_request_data
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and model_code			= @model_code
and approve_yn	=	'S'
;

delete from
	dbo.tb_param_approve_request_data
where
	corp_id				= @corp_id
and fac_id				= @fac_id
and model_code			= @model_code
and approve_yn	=	'S'
;