insert into
	dbo.tb_panel_ng
(
	corp_id,
	fac_id,
	item_key,
	panel_row_key,
	panel_group_key,
	device_id,
	eqp_code,
	panel_id,
	ng_remark,
	scan_dt,
	create_dt,
	recipe_judge,
	param_judge
)
values
(
	@corp_id
,	@fac_id
,	@item_key
,	@panel_row_key
,	@panel_group_key
,	@device_id
,	@eqp_code
,	@panel_id
,	@ng_remark
,	@scan_dt
,	getDate()
,	@recipe_judge
,	@param_judge
);
