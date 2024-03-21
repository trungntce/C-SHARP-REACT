SELECT 
	'/anypage/facno/' + a.fac_no  + '/eqptype/' + a.eqp_type + '/' + a.eqp_code  AS url
FROM
	tb_eqp_real a 
WHERE
	eqp_code = @eqp_code
;