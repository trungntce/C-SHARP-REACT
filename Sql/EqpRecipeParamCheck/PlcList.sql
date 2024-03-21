select
	factoryname
	,symbolkey 
	, eqcode as eqp_code
	, 'L' as raw_type
	, tablename
	, columnname
	, symbolcomment as first_name
	, symbolused
	, pick 
	, pvsv
	, symbolcomment as last_name
from
	dbo.raw_plcsymbol_infotable
where eqcode = @eqp_code
order by columnname