declare @eqp_code varchar(30) = 'M-119-03-V002';


select distinct
	equip as eqp_code
,	tablename
,	'P' as raw_type
from
	dbo.raw_pc_infotable
where
	equip = @eqp_code
union all
select distinct
	eqcode as eqp_code
,	tablename
,	'L' as raw_type
from
	dbo.raw_plcsymbol_infotable
where
	eqcode = @eqp_code
;