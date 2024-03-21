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
    	laser = 'Y'
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
	and laser = 'Y'
end
else
begin
if('recipe.copper' = @usergroup)
begin
    update
    	dbo.tb_model_registed_history
    set
    	copper = 'Y'
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
	and copper = 'Y'
end
else
begin
if('recipe.pt' = @usergroup)
begin
    update
    	dbo.tb_model_registed_history
    set
    	pt = 'Y'
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
	and	pt = 'Y'
end
else
begin
if('recipe.hp' = @usergroup)
begin
    update
    	dbo.tb_model_registed_history
    set
    	hp = 'Y'
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
	and	hp = 'Y'
end
else
begin
if('recipe.psr' = @usergroup)
begin
    update
    	dbo.tb_model_registed_history
    set
    	psr = 'Y'
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
	and	psr = 'Y'
end
else
begin
if('recipe.ir' = @usergroup)
begin
    update
    	dbo.tb_model_registed_history
    set
    	ir = 'Y'
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
	and	ir = 'Y'
end
else
begin
if('recipe.surface' = @usergroup)
begin
    update
    	dbo.tb_model_registed_history
    set
    	surface = 'Y'
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
	and	surface = 'Y'
end
else
begin
    update
    	dbo.tb_model_registed_history
    set
    	backend = 'Y'
	where 
		model_code = @model_code
	and approve_key = ''
	and request_id = ''
	and	backend = 'Y'
end
end
end
end
end
end
end
end
;