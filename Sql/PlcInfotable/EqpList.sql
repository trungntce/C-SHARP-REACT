with cte as
(
	select distinct 
		eqcode 
	,	tablename
	,	upper(roomname) as room_name
	from 
		dbo.raw_plcsymbol_infotable
	where
		symbolused = 'Y'
)
select
	eqp.EQUIPMENT_CODE			as eqp_code
,	eqp.EQUIPMENT_DESCRIPTION	as eqp_description
,	cte.tablename				as table_name
,	cte.room_name
from
	cte
join
	erp_sdm_standard_equipment eqp
	on	cte.eqcode = eqp.EQUIPMENT_CODE
where
	eqp.ENABLED_FLAG = 'Y'
;