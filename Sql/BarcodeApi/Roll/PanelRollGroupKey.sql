select
	workorder
,	row_key
,	group_key
from 
	tb_panel_4m 
where workorder in 
(
	select 
		workorder 
	from 
		tb_roll_panel_map 
	where
		roll_id = @roll_id
	and 
		panel_id= @panel_id
)
and oper_code =@oper_code
and oper_seq_no=@oper_seq_no
order by create_dt asc