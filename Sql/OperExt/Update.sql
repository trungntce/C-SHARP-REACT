update 
	dbo.tb_oper_ext
set 
	oper_yn				= isnull(cast(@oper_yn as char), 'N')
,	scan_eqp_yn			= isnull(cast(@scan_eqp_yn as char), 'N')
,	scan_worker_yn		= isnull(cast(@scan_worker_yn as char), 'N')
,	scan_material_yn	= isnull(cast(@scan_material_yn as char), 'N')
,	scan_tool_yn		= isnull(cast(@scan_tool_yn as char), 'N')
,	scan_panel_yn		= isnull(cast(@scan_panel_yn as char), 'N')
,	scan_type			= isnull(cast(@scan_type as char), 'P')
,	start_yn			= isnull(cast(@start_yn as char), 'N')
,	end_yn				= isnull(cast(@end_yn as char), 'N')
,	rework_yn			= isnull(cast(@rework_yn as char), 'N')
,	split_yn			= isnull(cast(@split_yn as char), 'N')
,	merge_yn			= isnull(cast(@merge_yn as char), 'N')
,	remark				= @remark			
,	update_user			= @update_user		
,	update_dt			= getdate()
where 
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	operation_code		= @operation_code
;
