update 
	dbo.tb_spc_8rule_blacklist
set
	oper_code = @oper_code
,	inspection_desc = @inspection_desc
,	eqp_code = @eqp_code
,	item_code = @item_code
,	judge_rule_1_x = @judge_rule_1_x
,	judge_rule_1_r = @judge_rule_1_r
,	judge_rule_2 = @judge_rule_2
,	judge_rule_3 = @judge_rule_3
,	judge_rule_4 = @judge_rule_4
,	judge_rule_5 = @judge_rule_5
,	judge_rule_6 = @judge_rule_6
,	judge_rule_7 = @judge_rule_7
,	judge_rule_8 = @judge_rule_8
,	remark		= @remark
,	update_user = @update_user
,	update_dt = getdate()
where
	row_no = @row_no