select
	panel.*
,	[param].param_name
from
	dbo.tb_panel_param panel
join
	dbo.tb_param [param]
	on	panel.param_id = [param].param_id
where
	item_key = @item_key
order by
	panel.param_id
;

select
	panel.*
,	recipe.recipe_name
from
	dbo.tb_panel_recipe panel
join
	dbo.tb_recipe recipe
	on	panel.recipe_code = recipe.recipe_code
where
	item_key = @item_key
order by
	recipe.recipe_code
;