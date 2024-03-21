select
	DISTINCT tablename 
from
	raw_plcsymbol_infotable rpi 
where
	eqcode = @eqp_code
;