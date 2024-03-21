select
	eqp_code
,	fac_no 
,	room_name 
,	eqp_type
,	operation_yn 
,  	'/anypage/facno/' + a.fac_no  + '/roomname/' + a.room_name  AS url
from
	tb_eqp_real a
where
	fac_no in ((select [value] from string_split(@fac_no, ',')));