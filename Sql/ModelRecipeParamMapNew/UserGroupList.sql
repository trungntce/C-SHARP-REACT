SELECT 
	JSON_TABLE.value as usergroup
FROM tb_user as a
CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
WHERE a.user_id = @create_user
and JSON_TABLE.value in ('recipe.laser','recipe.copper','recipe.pt','recipe.hp','recipe.ir','recipe.psr','recipe.surface','recipe.backend')
;