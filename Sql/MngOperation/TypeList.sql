select
	a.eqp_code 
,	a.eqp_description 	as eqp_name
,	a.eqp_type		 	as type_num	  
,	b.ft_descriptioon 	as type_name
from
	tb_eqp_real a
join tb_eqp_filter b on a.eqp_type = b.ft_key;