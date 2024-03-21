select
    a.*
,   b.recipe_name
from
    dbo.tb_panel_recipe a
left join
    dbo.tb_recipe b
    on a.recipe_code = b.recipe_code
where
    a.item_key = @item_key
;