INSERT INTO
	dbo.tb_panel_realtime
(
	panel_id
,	workorder
,	model_code
,	interlock_yn
,	defect_yn
,	rework_approve_yn
,	create_dt
)
VALUES(
	@panel_id
,	@workorder
,	@model_code
,	'N'
,	'N'
,	'N'
,	getdate()
);

  