delete from
	dbo.tb_param
where
	corp_id = @corp_id
and fac_id = @fac_id
and group_code = @group_code
;

delete from
	dbo.tb_recipe
where
	corp_id = @corp_id
and fac_id = @fac_id
and group_code = @group_code
;

delete from
	dbo.tb_param_recipe_group
where
	corp_id = @corp_id
and fac_id = @fac_id
and group_code = @group_code
;
