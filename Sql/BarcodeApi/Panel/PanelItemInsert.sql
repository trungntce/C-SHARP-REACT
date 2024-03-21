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
,	@panel_group_key
,	@device_id
,	@eqp_code
,	@panel_id
,	@scan_dt
,	getdate()
;

--	exec sp_panel_realtime_insert_firsttime @item_key
	
--	exec sp_roll_panel_map_insert_firsttime @item_key