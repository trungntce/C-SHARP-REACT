delete from
	dbo.tb_recipe
where
	corp_id				= @corp_id			
and fac_id				= @fac_id			
and eqp_code			= @eqp_code
and recipe_code			= @recipe_code		
and approve_key			= ''
;
