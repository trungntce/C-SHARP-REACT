IF EXISTS (
  	select 
		* 
	from 
		dbo.tb_recipe_model_approve
	where 
		model_code = @model_code
)
begin
	with cte as 
	(
		select 
			top 1 * 
		from 
			dbo.tb_recipe_model_approve
		where 
			model_code = @model_code
		order by approve_dt desc 
	)
	insert into 
		dbo.tb_recipe_model_approve
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
	select 
		cte.corp_id
	,	cte.fac_id
	,	@approve_key
	,	@model_code
	,	case cte.approve_yn 
			when 'Y' then 'N'
			when 'N' then 'N'
			when 'R' then 'D'
			when 'D' then 'D'
		end
	,	getdate()
	,	@create_user
	,	getdate()
	from 
		cte
end
else
begin
	insert into 
		dbo.tb_recipe_model_approve
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
	,	'N' -- 승인요청
	,	getdate()
	,	@create_user
	,	getdate()
	)
end
;

IF EXISTS (
  	select 
		* 
	from 
		dbo.tb_param_model_approve
	where 
		model_code = @model_code
)
begin
	with cte as 
	(
		select 
			top 1 * 
		from 
			dbo.tb_param_model_approve
		where 
			model_code = @model_code
		order by approve_dt desc 
	)
	insert into 
		dbo.tb_param_model_approve
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
	select 
		cte.corp_id
	,	cte.fac_id
	,	@approve_key
	,	@model_code
	,	case cte.approve_yn 
			when 'Y' then 'N'
			when 'N' then 'N'
			when 'R' then 'D'
			when 'D' then 'D'
		end
	,	getdate()
	,	@create_user
	,	getdate()
	from 
		cte
end
else
begin
	insert into 
		dbo.tb_param_model_approve
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
	,	'N' -- 승인요청
	,	getdate()
	,	@create_user
	,	getdate()
	)
end
;