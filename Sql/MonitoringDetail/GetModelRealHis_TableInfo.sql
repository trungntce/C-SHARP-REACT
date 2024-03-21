
with cte as
(
	select distinct 
		equip		as eqp_code
	,	'P' as raw_type
	,	tablename
	from
		dbo.raw_pc_infotable
	where
		equip not in ('M-102-01-V001')
		and main in ('Y','y')
	union
	select DISTINCT 
		eqcode		as eqp_code
	,	'L' as raw_type
	,	tablename
	from
		dbo.raw_plcsymbol_infotable
	where 
		eqcode not in ('M-119-03-V002')
)
select
	tablename, raw_type
from
	cte
where
	eqp_code = @eqp_code
;



