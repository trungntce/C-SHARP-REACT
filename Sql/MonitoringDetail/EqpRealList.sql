select 
	dateadd(hh,-8,getdate()) as mes_dt
,	a.*
,	b.ft_descriptioon as room_name_des
,	c.ft_descriptioon as eqp_type_des
from 
	dbo.tb_eqp_real a
join tb_eqp_filter b
on	a.room_name = b.ft_key
join tb_eqp_filter c
on a.eqp_type = c.ft_key 
where
	1=1
and	fac_no			= @fac_no
and	room_name		= @room_name
and	eqp_type		= @eqp_type
;
