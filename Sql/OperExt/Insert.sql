insert into 
	dbo.tb_oper_ext
(
	corp_id
,	fac_id
,	operation_code

,	oper_yn
,	scan_eqp_yn
,	scan_worker_yn
,	scan_material_yn
,	scan_tool_yn
,	scan_panel_yn
,	scan_type
,	start_yn
,	end_yn
,	rework_yn
,	split_yn
,	merge_yn
,	remark
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@operation_code

,	isnull(cast(@oper_yn as char), 'N')
,	isnull(cast(@scan_eqp_yn as char), 'N')
,	isnull(cast(@scan_worker_yn as char), 'N')
,	isnull(cast(@scan_material_yn as char), 'N')
,	isnull(cast(@scan_tool_yn as char), 'N')
,	isnull(cast(@scan_panel_yn as char), 'N')
,	isnull(cast(@scan_type as char), 'P')
,	isnull(cast(@start_yn as char), 'N')
,	isnull(cast(@end_yn as char), 'N')
,	isnull(cast(@rework_yn as char), 'N')
,	isnull(cast(@split_yn as char), 'N')
,	isnull(cast(@merge_yn as char), 'N')
,	@remark
,	@create_user
,	getdate()
;