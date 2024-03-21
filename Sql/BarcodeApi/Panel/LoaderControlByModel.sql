select 
	count(*) as cnt
from 
	tb_panel_4m [4m]
	join
	tb_code code
	on [4m].model_code = code.code_id 
where 
	[4m].end_dt is null
	and [4m].eqp_code = @eqp_code
	and code.codegroup_id = 'LOADER_CONTROL_BY_MODEL'
	and code.use_yn = 'Y'