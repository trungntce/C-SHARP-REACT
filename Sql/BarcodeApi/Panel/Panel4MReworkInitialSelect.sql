select
  *
from 
  dbo.fn_panel_4m_rework_initial_select(@row_key, @group_key, @workorder,@oper_code, @oper_seq_no, @eqp_code, @start_yn, @end_yn)