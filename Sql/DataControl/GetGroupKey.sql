select
	*
from
	tb_panel_4m	
where
	workorder = @workorder
	and oper_seq_no = @oper_seq_no
	and eqp_code = @eqp_code
;