select
	insp_date 
,	insp_time
,	case 
		when type_desc = 'IPQC' then 'IPQC 치수 검사'
		when type_desc = 'CMI' then 'CMI두께'
		when type_desc = 'IQC' then 'IQC 치수 검사'
		else type_desc
	end as [type_desc]
,   oper_name
,   inspection_desc
,   judge

,	lsl
,	usl
,	lcl
,	ucl
,	min_val
,	max_val
,	dateadd(day, -7, insp_date) as search_from
,	insp_date as search_to
from
	dbo.tb_panel_4m_spc_union
where
	header_group_key = @header_group_key
;