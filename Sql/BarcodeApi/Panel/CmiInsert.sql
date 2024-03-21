
insert into 
	dbo.tb_panel_cmi
(
	corp_id
,	fac_id
,	panel_id
,	device_id
,	eqp_code
,	scan_dt
,	create_dt	
)
select 
	@corp_id
,	@fac_id
,	@panel_id
,	@device_id
,	@eqp_code
,	@scan_dt
,	GETDATE()