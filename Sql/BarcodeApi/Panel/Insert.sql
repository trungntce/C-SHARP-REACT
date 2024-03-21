insert into 
	dbo.tb_panel_4m
(
	corp_id
,	fac_id
,	row_key
,	device_id
,	workorder
,	oper_code
,	eqp_code
,	worker_code
,	material_code
,	tool_code
,	scan_dt
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@row_key
,	@device_id
,	@workorder
,	@oper_code
,	@eqp_code
,	@worker_code
,	@material_code
,	@tool_code
,	@scan_dt
,	getdate()
;