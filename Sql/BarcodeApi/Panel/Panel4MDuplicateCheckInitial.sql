select 
*
from 
tb_panel_4m_initial
where workorder = @workorder
and oper_seq_no = @oper_seq_no
and oper_code = @oper_code