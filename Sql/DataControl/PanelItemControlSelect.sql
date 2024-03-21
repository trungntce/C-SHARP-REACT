select 
	group_key
,	device_id
,	eqp_code
,	start_dt
,	end_dt 
from 
	tb_panel_4m 
where 
	workorder = @workorder
	and oper_seq_no = @oper_seq_no
order by group_key asc;