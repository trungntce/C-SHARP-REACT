with cte as 
(
	select
		*
	from
		tb_diwater_map a
	where
		eqp_code = @eqp_code
)
select
	b.eqcode 	as di_code
,	'd006' 		as di_column	
,	b.tablename	as di_table
,	a.eqp_code 	as eqp_code
,	a.nonconductivity
,	a.nonconductivity_table 
,	a.conductivity 
,	a.conductivity_table 
from
	cte	a
cross apply
(
	select
		top 1
			eqcode
		,	tablename
	from
		raw_plcsymbol_infotable 
	where
		eqcode = a.parant_id
) b
