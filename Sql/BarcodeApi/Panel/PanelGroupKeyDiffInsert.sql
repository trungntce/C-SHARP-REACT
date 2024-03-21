insert into 
	dbo.tb_panel_item
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
select
	@corp_id
,	@fac_id				
,	@item_key
,	'NO4M'
,	@device_id
,	@eqp_code
,	@panel_id
,	@scan_dt
,	getdate()
;
