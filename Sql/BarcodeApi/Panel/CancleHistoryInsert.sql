INSERT
	INTO
	MES.dbo.tb_cancel_history
(
	corp_id
,	fac_id
,	group_key
,	device_id
,	cancle_type
,	cancle_type_code
,	cancle_code
,	workorder
,	oper_seq_no
,	oper_code
,	material_list
,	eqp_list
,	worker_list
,	roll_id
,	panel_id
,	remark
,	create_dt
)
VALUES(
	@corp_id
,	@fac_id
,	@group_key
,	@device_id
,	@cancle_type
,	@cancle_type_code
,	@cancle_code
,	@workorder
,	@oper_seq_no
,	@oper_code
,	@material_list
,	@eqp_list
,	@worker_list
,	@roll_id
,	@panel_id
,	@remark
,	getdate()
);