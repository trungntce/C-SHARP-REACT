INSERT
	INTO
	MES.dbo.tb_panel_item
	(	
	corp_id
,	fac_id
,	item_key
,	panel_group_key
,	device_id
,	eqp_code
,	panel_id
,	scan_dt
,	create_dt
)
VALUES(
	'SIFLEX'
,	'SIFLEX'
,	@item_key
,	@panel_group_key
,	@device_id
,	@eqp_code
,	@panel_id
,	@scan_dt
,	@create_dt
);