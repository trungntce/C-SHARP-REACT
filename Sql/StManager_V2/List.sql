select
	a.eqp_code 				
,	a.eqp_description
,	a.fac_no 
,	facno.ft_descriptioon		as fac_no_description
,	a.room_name 
,	roomname.ft_descriptioon 	as room_name_description
,	a.eqp_type 
,	eqptype.ft_descriptioon 	as eqp_type_description
,	a.default_st
from 
	tb_eqp_real a
left outer join tb_eqp_filter facno 		on a.fac_no = facno.ft_key 
left outer join tb_eqp_filter roomname 		on a.room_name = roomname.ft_key 
left outer join tb_eqp_filter eqptype 		on a.eqp_type = eqptype.ft_key
where
	eqp_code = @eqp_code
	and 'y' = 'y'
;