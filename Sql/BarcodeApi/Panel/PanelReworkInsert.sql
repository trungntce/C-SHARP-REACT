INSERT INTO dbo.tb_panel_rework
(
	corp_id
,	fac_id
,	oper_seq
,	oper_code
,	oper_name
,	panel_id
,	roll_id
,	put_remark
,	rework_code
,	put_update_user
,	put_dt
)
VALUES
(
	@corp_id
,	@fac_id
,	@oper_seq
,	@oper_code
,	@oper_name
,	@panel_id
,	@roll_id
,	@put_remark
,	@rework_code
,	@put_update_user
,	getdate()
);