UPDATE 
	MES.dbo.tb_panel_4m
SET 
	oper_seq_no=@oper_seq_no
,	real_seq_no=@real_seq_no
WHERE 	
	row_key = @row_key and 
	group_key = @group_key;
--	workorder = @workorder and 
--	oper_code = @oper_code and
--	oper_seq_no = @real_seq_no;
--	workorder = 'VPT230526402-00012' and 
--	oper_code = 'Q02010'