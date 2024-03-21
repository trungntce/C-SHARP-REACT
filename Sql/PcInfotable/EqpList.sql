declare @query nvarchar(max);

with cte as
(
	select distinct 
		tablename as table_name
	from
		dbo.raw_pc_infotable
	where
		(@room_name is null or roomname = @room_name)
), cte2 as
(
	select
		string_agg
		(
			cast(formatmessage('select distinct equip as eqp_code, ''%s'' as table_name from %s', table_name, table_name) as nvarchar(MAX))
		,	' union '
		) as table_list
	from
		cte
)
select
	@query = 'with cte_all as ( ' + table_list + ' ) ' + 
	'
	select distinct
		cte_all.table_name
	,	eqp.EQUIPMENT_CODE			as eqp_code
	,	eqp.EQUIPMENT_DESCRIPTION	as eqp_description
	from
		cte_all
	join
		dbo.erp_sdm_standard_equipment eqp
		on	cte_all.eqp_code = eqp.EQUIPMENT_CODE
		and eqp.SOB_ID = 90
		and eqp.ORG_ID = 901
	where
		EQUIPMENT_DESCRIPTION is not null
	order by
		table_name, eqp_code
	option (force order)
	;
	'
from
	cte2
;

execute(@query);
