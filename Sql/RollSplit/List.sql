select
	*
from
	tb_roll_map
where 
	corp_id 	= @corp_id
and fac_id 		= @fac_id
and create_dt 	>= @from_dt
and create_dt	< @to_dt
and child_id 	like '%' + @roll_id + '%'
;