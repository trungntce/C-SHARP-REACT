select
	'P'				as raw_type
,	equip			as eqp_code
,	tablename		as table_name
,	columnname		as column_name
,	columncomment	as symbolcomment
,	pvsv

,	null as base_val
,	null as std
,	null as lcl
,	null as ucl
,	null as lsl
,	null as usl
,	null as start_time
,	null as end_time
,	null as interlock_yn
,	null as alarm_yn
,	null as judge_yn
,	'' as param_id
,	'' as param_name
,	'' as recipe_code
,	'' as recipe_name
from
	dbo.raw_pc_infotable
where
	equip = @eqp_code
and pick = 'Y'
union all
select
	'L'				as raw_type
,	eqcode
,	tablename
,	columnname
,	symbolcomment
,	pvsv

,	null as base_val
,	null as std
,	null as lcl
,	null as ucl
,	null as lsl
,	null as usl
,	null as start_time
,	null as end_time
,	null as interlock_yn
,	null as alarm_yn
,	null as judge_yn
,	'' as param_id
,	'' as param_name
,	'' as recipe_code
,	'' as recipe_name
from
	dbo.raw_plcsymbol_infotable
where
	eqcode = @eqp_code
and	pick = 'Y'
order by 
	columnname
;