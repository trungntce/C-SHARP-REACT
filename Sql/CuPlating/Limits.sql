select 
	recipe_code 
,	lsl
,	usl	
from 
	dbo.tb_recipe
WHERE 
	eqp_category_code = @eqp_code
;