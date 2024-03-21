select top 1
	*
from 
	tb_panel_4m
where
	group_key = @group_key
and
	workorder is not null
and
	oper_code ='L05030'