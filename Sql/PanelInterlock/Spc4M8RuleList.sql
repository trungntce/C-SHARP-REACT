select
	inspection_date as insp_date
,	inspection_time as insp_time
,	case 
		when type_desc = 'IPQC' then 'IPQC 치수 검사'
		when type_desc = 'CMI' then 'CMI두께'
		when type_desc = 'IQC' then 'IQC 치수 검사'
		else type_desc
	end as [type_desc]
,   oper_name
,   inspection_desc
,   case 
		when judge_spec_ng = 'NG' then 'NG'
        else 'CHK' 
    end as judge 

,	case when judge_spec_ng = 'NG' then 'SPEC ' else '' end + 
	case when judge_rule_1_x = 'CHK' then 'X ' else '' end + 
	case when judge_rule_1_r = 'CHK' then 'R ' else '' end + 
	case when judge_rule_2 = 'CHK' then '2 ' else '' end + 
	case when judge_rule_3 = 'CHK' then '3 ' else '' end + 
	case when judge_rule_4 = 'CHK' then '4 ' else '' end + 
	case when judge_rule_5 = 'CHK' then '5 ' else '' end + 
	case when judge_rule_6 = 'CHK' then '6 ' else '' end + 
	case when judge_rule_7 = 'CHK' then '7 ' else '' end + 
	case when judge_rule_8 = 'CHK' then '8 ' else '' end as spc_rule_ng_list

,	lsl
,	usl
,	lcl
,	ucl
,	[min] as min_val
,	[max] as max_val

,	search_from
,	search_to   
from
	dbo.tb_panel_4m_spc_8rule
where
	header_group_key = @header_group_key
;