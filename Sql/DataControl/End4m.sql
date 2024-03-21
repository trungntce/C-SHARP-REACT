update 
	tb_panel_4m
set 
	end_dt = getdate()
where 
	group_key = (
		select 
			top 1 group_key 
		from 
			tb_panel_4m 
		where 
			end_dt is null
			and workorder = @workorder
			and oper_seq_no = @oper_seq_no
			and eqp_code = @eqp_code
	)
	