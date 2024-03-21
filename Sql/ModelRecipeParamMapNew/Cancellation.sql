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
		laser = 'N',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
end
else
begin
if('recipe.copper' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		copper = 'N',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
end
else
begin
if('recipe.pt' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		pt = 'N',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
end
else
begin
if('recipe.hp' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		hp = 'N',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
end
else
begin
if('recipe.psr' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		psr = 'N',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
end
else
begin
if('recipe.ir' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		ir = 'N',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
end
else
begin
if('recipe.surface' = @usergroup)
begin
	update
		dbo.tb_model_registed_history
	set
		surface = 'N',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
end
else
begin
	update
		dbo.tb_model_registed_history
	set
		backend = 'N',
		update_user = @create_user,
		update_dt = getdate()
	where 
		model_code = @model_code
	and approve_key = ''
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
	,	'N'
	,	'N'
	,	'N'
	,	'N'
	,	'N'
	,	'N'
	,	'N'
	,	'N'
	,	@create_user
	,	getdate()
	,	null
	,	null
end
;