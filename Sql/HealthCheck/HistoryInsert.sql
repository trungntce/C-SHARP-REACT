insert into
	dbo.tb_healthcheck_history
(	
	eqp_code
,	type_code
,	create_dt
)
values
(
	@eqp_code
, 	@type_code
, 	@current_date
)