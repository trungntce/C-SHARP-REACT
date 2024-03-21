select 
	factoryname
	, roomname
	, equip as eqp_code
	, 'P' as raw_type
	, tablename
	, columnname
	, columncomment as first_name
	, pick
	, pvsv 
	, columncomment as last_name
from 
	dbo.raw_pc_infotable
where equip = @eqp_code
	