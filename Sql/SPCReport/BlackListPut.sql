insert into
	MES.dbo.tb_spc_8rule_blacklist
(
	corp_id
,	fac_id
,	oper_code
,	inspection_desc
,	eqp_code
,	item_code
,	judge_spec_ng
,	judge_rule_1_x
,	judge_rule_1_r
,	judge_rule_2
,	judge_rule_3
,	judge_rule_4
,	judge_rule_5
,	judge_rule_6
,	judge_rule_7
,	judge_rule_8
,	remark
,	create_user
,	create_dt
,	update_user
,	update_dt
)
select
	@corp_id
,	@corp_id
,	@oper_code
,	@inspection_desc
,	@eqp_code
,	@item_code
,	'Y' -- SPEC NG 추가 대비용
,	@judge_rule_1_x
,	@judge_rule_1_r
,	@judge_rule_2
,	@judge_rule_3
,	@judge_rule_4
,	@judge_rule_5
,	@judge_rule_6
,	@judge_rule_7
,	@judge_rule_8
,	@remark
,	@create_user
,	getdate()
,	null
,	null
;