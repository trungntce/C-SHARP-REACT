update
	dbo.tb_oper_insp_matter_4m
set
	material_yn = @material_yn
,	tool_yn = @tool_yn
,	worker_yn = @worker_yn
,	sampling_yn = @sampling_yn
,	total_insp_yn = @total_insp_yn
,	spc_yn = @spc_yn
,	qtime_yn = @qtime_yn
,	chem_yn = @chem_yn
,	recipe_yn = @recipe_yn
,	param_yn = @param_yn
,	panel_yn = @panel_yn
,	remark = @remark
,	update_dt = getdate()
,	update_user = @update_user
where
	row_no = @row_no
;