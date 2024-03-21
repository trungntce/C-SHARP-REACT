select 
	*
from 
	dbo.tb_panel_4m
where 
	workorder = @workorder 		and 
	oper_seq_no = @real_seq_no	and
	oper_code = @oper_code