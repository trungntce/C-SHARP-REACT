IF NOT EXISTS (
  	select 
		* 
	from 
		dbo.tb_recipe_approve_request_data
	where 
		model_code = @model_code
	and approve_yn	=	'S'
)
begin
	insert into 
		dbo.tb_recipe_approve_request_data
	(
		corp_id
	,	fac_id
	,	approve_key
	,	model_code
	,	approve_yn
	,	approve_dt
	,	create_user
	,	create_dt
	)
	values
	(
		@corp_id
	,	@fac_id
	,	@approve_key
	,	@model_code
	,	'S'
	,	getdate()
	,	@create_user
	,	getdate()
	)
end
;

IF NOT EXISTS (
  	select 
		* 
	from 
		dbo.tb_param_approve_request_data
	where 
		model_code = @model_code
	and approve_yn	=	'S'
)
begin
	insert into 
		dbo.tb_param_approve_request_data
	(
		corp_id
	,	fac_id
	,	approve_key
	,	model_code
	,	approve_yn
	,	approve_dt
	,	create_user
	,	create_dt
	)
	values
	(
		@corp_id
	,	@fac_id
	,	@approve_key
	,	@model_code
	,	'S'
	,	getdate()
	,	@create_user
	,	getdate()
	)
end
;