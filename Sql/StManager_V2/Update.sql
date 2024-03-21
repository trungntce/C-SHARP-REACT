update tb_eqp_real 
set
	default_st = @default_st
where
	eqp_code	= @eqp_code
AND
	fac_no		= @fac_no
AND
	room_name	 = @room_name
;
