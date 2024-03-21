IF EXISTS (
  	select 
		* 
	from 
		dbo.tb_model_registed_history
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
)
begin
if('recipe.laser' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		laser = 'Y',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key	=	''
	and request_id = ''
end
else
begin
if('recipe.copper' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		copper = 'Y',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key	=	''
	and request_id = ''
end
else
begin
if('recipe.pt' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		pt = 'Y',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key	=	''
	and request_id = ''
end
else
begin
if('recipe.hp' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		hp = 'Y',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key	=	''
	and request_id = ''
end
else
begin
if('recipe.psr' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		psr = 'Y',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key	=	''
	and request_id = ''
end
else
begin
if('recipe.ir' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		ir = 'Y',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key	=	''
	and request_id = ''
end
else
begin
if('recipe.surface' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		surface = 'Y',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key	=	''
	and request_id = ''
end
else
begin
	update
		dbo.tb_model_registed_history
	set
		backend = 'Y',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key	=	''
	and request_id = ''
end
end
end
end
end
end
end
end
else
begin
	insert into
	dbo.tb_model_registed_history
	(
		corp_id
	,	fac_id
	,	model_code
	,	approve_key
	,	request_id
	,	laser
	,	copper
	,	pt
	,	hp
	,	psr
	,	ir
	,	surface
	,	backend
	,	create_user
	,	create_dt
	,	update_user
	,	update_dt
	)
	select
		@corp_id
	,	@fac_id
	,	@model_code
	,	''
	,	''
	,	case when @usergroup = 'recipe.laser' then 'Y' else 'N' end
	,	case when @usergroup = 'recipe.copper' then 'Y' else 'N' end
	,	case when @usergroup = 'recipe.pt' then 'Y' else 'N' end
	,	case when @usergroup = 'recipe.hp' then 'Y' else 'N' end
	,	case when @usergroup = 'recipe.psr' then 'Y' else 'N' end
	,	case when @usergroup = 'recipe.ir' then 'Y' else 'N' end
	,	case when @usergroup = 'recipe.surface' then 'Y' else 'N' end
	,	case when @usergroup = 'recipe.backend' then 'Y' else 'N' end
	,	@create_user
	,	getdate()
	,	null
	,	null
end
;