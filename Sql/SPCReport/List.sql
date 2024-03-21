with cte as (
	select
		*
	,	ROW_NUMBER() OVER(ORDER BY (SELECT 1)) as row_num
	,	case 
			when judge_spec_ng = 'NG' then 'NG'
			when judge_rule_1_x = 'CHK' or judge_rule_1_r = 'CHK' or judge_rule_2 = 'CHK' or judge_rule_3 = 'CHK' or judge_rule_4 = 'CHK' or judge_rule_5 = 'CHK' or judge_rule_6 = 'CHK' or judge_rule_7 = 'CHK' or judge_rule_8 = 'CHK' then 'CHK'
			else 'OK'
		end as status_flag
	from 
		fn_spc_rule_judge_renewal(null, null, @from_dt, @to_dt, @item_code, @model_code, @oper_code, convert(nvarchar(500), @inspect_desc), null, null, @eqp_code, @judge)
)select * from cte
;
