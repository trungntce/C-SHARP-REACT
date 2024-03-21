select
	insp_date 
,	insp_time
,	'약품분석' as [type_desc]
,   oper_name
,   inspection_desc
,	criteria_desc
,	judge

,	val
,	lsl
,	usl
,	lcl
,	ucl
from
	dbo.tb_panel_4m_chem
where
	header_group_key = @header_group_key
;