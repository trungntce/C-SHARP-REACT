--MADE BY SIFLEX
	delete from
		dbo.tb_model_oper_ext
	where 
		corp_id				= @corp_id
	and	fac_id				= @fac_id
	and	model_code			= @to_model_code
	and operation_seq_no	= @operation_seq_no
	and operation_code		= @operation_code
	;	
	
	INSERT INTO 
		dbo.tb_model_oper_ext
	(
		corp_id, 
		fac_id, 
		model_code, 
		operation_seq_no, 
		operation_code, 
		oper_yn, 
		scan_eqp_yn,
		scan_worker_yn,
		scan_material_yn,
		scan_tool_yn,
		scan_panel_yn,
		scan_type,
		start_yn,
		end_yn,
		rework_yn,
		split_yn,
		merge_yn,
		remark,
		eqp_json,
		create_user,
		create_dt,
		update_user,
		update_dt
	) 
select
	@corp_id
,	@fac_id
,	@to_model_code
,	@operation_seq_no
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
,	@eqp_json
,	@create_user
,	getdate()
,	@create_user
,	getdate()
;