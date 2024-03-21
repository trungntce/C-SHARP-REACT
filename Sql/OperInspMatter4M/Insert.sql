INSERT INTO
	MES.dbo.tb_oper_insp_matter_4m
(
	corp_id
,	fac_id
,	oper_code
,	material_yn
,	tool_yn
,	worker_yn
,	sampling_yn
,	total_insp_yn
,	spc_yn
,	qtime_yn
,	chem_yn
,	recipe_yn
,	param_yn
,	panel_yn
,	remark
,	create_user
,	create_dt
)
VALUES(
	@corp_id
,	@fac_id
,	@oper_code
,	@material_yn
,	@tool_yn
,	@worker_yn
,	@sampling_yn
,	@total_insp_yn
,	@spc_yn
,	@qtime_yn
,	@chem_yn
,	@recipe_yn
,	@param_yn
,	@panel_yn
,	@remark
,	@create_user
,	getDate()
);