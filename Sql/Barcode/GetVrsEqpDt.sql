select
	vrs.equip 
,	max(vrs.inserttime) as eqp_last_dt
from
	dbo.raw_vrs_orbotech_error vrs
group by vrs.equip 
;