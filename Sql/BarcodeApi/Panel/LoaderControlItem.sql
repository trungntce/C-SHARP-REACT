select
	count(*) as cnt
FROM 
	tb_panel_4m [4m]
	join
	tb_code code
	on [4m].model_code = code.code_id
where
	[4m].group_key = @panel_group_key
	and code.codegroup_id = 'LOADER_CONTROL_BY_MODEL'
	and code.use_yn = 'Y'