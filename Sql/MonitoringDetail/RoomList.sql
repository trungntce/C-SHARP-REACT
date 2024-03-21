select
	DISTINCT 
	a.room_name 
,	c.ft_descriptioon as room_name_des
from
	tb_eqp_real a
join
	tb_eqp_filter b
on
	a.fac_no = b.ft_key 
join 
	tb_eqp_filter c
on
	a.room_name = c.ft_key 
where
	'y' = 'y'
	and	fac_no = @fac_no
;