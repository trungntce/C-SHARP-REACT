insert into 
	dbo.tb_panel_item
(
	row_key
,	panel_row_key
,   panel_group_key
,	device_id
,	panel_id
,	scan_dt
,	create_dt
,	recipe_judge
,	param_judge
)
select
	@row_key
,	@panel_row_key
,   @panel_group_key
,	@device_id
,	@panel_id
,	@scan_dt
,	getdate()
,	@recipe_judge
,	@param_judge
;