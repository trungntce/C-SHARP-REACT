insert into
	tb_panel_4m_cmi
(
	corp_id
,	fac_id
,	device_id
,	row_key
,	group_key
,	workorder
,	eqp_code
,	create_dt
,	start_dt_4m
)
select 
	@corp_id
,	@fac_id
,	@device_id
,	@row_key
,	@group_key
,	@workorder
,	@eqp_code
,	getdate()
,	getdate()
;
