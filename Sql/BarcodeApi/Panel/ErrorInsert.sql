insert into 
	dbo.tb_panel_error
(
	corp_id
,	fac_id
,	row_key
,	error_code
,	ip_addr
,	oper_code
,	eqp_code
,	img_path
,	scan_dt
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@row_key
,	@error_code
,	@ip_addr
,	@oper_code
,	@eqp_code
,	@img_path
,	@scan_dt
,	getdate()
;