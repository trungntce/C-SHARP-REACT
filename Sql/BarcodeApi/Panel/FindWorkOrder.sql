select
	tpi.panel_row_key
,	tpi.panel_group_key
,	tpi.panel_id
,	tpm.oper_seq_no
,	tpm.workorder
,	tpm.oper_code
from
	tb_panel_item tpi join 
	tb_panel_4m tpm on tpi.panel_group_key = tpm.group_key 
where 
	tpi.panel_id = @panel_id 