with cte as
(
	select 
		tablename
	,	factoryname
	,	roomname
	,	eqp_code
	,	columnname
	,	first_name
	,	last_name
	,	pick
	,	pvsv
	from 
		openjson(@json) 
		with 
		(
			tablename varchar(50) '$.tablename'
		,	factoryname varchar(100) '$.factoryname'
		,	roomname varchar(100) '$.roomname'
		,	eqp_code varchar(100) '$.eqpCode'
		,	columnname varchar(100) '$.columnname'
		,	first_name varchar(100) '$.firstName'
		,	last_name varchar(100) '$.lastName'
		,	pick varchar(100) '$.pick'
		,	pvsv varchar(100) '$.pvsv'
		)
)
update
	dbo.raw_pc_infotable
set
	columncomment = case when cte.first_name is null or cte.first_name = '' then '' else cte.first_name end + 
		case when cte.last_name is null or cte.last_name = '' then '' else '||' + cte.last_name end
	, pick = case when cte.pick is null or cte.pick = '' then '' else cte.pick end
	, pvsv = case when cte.pvsv is null or cte.pvsv = '' then '' else cte.pvsv end 
from 
	cte
join 
	dbo.raw_pc_infotable a 
 	on a.tablename = cte.tablename
	and a.factoryname = cte.factoryname
	and a.roomname = cte.roomname
	and a.equip = cte.eqp_code
	and a.columnname = cte.columnname
where
	a.tablename = cte.tablename
	and a.factoryname = cte.factoryname
	and a.roomname = cte.roomname
	and a.equip = cte.eqp_code
	and a.columnname = cte.columnname
;