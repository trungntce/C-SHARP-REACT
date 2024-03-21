select top 1
*
from 
tb_panel_4m
where workorder = @workorder
order by oper_seq_no desc

  --select top 1
  --*
  --from dbo.fn_panel_4m_select(@row_key, @group_key,@workorder, @oper_seq_no)
  --order by oper_seq_no desc