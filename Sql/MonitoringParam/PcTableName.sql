select
	DISTINCT tablename 
from
	raw_pc_infotable rpi 
where
	equip = @eqp_code
;