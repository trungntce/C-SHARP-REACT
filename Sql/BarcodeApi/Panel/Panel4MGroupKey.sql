select 
	[4m].*
,	isnull(code.use_yn, 'N') as laser_oper
from 
	tb_panel_4m  [4m]
left join 
	tb_code code
	on code.codegroup_id = 'LASER_OPER'
	and [4m].oper_code = code.code_name
where 
	group_key = @group_key
order by 
	row_key asc
