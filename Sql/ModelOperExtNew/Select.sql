select 
	a.OPERATION_CODE		as operation_code
,	a.OPERATION_DESCRIPTION as operation_desc
,	a.WORKING_UOM			as working_uom
,	a.ENABLED_FLAG			as enable_flag

,	b.oper_yn
,	b.scan_eqp_yn
,	b.scan_worker_yn
,	b.scan_material_yn
,	b.scan_tool_yn
,	b.scan_panel_yn
,	b.scan_type
,	b.start_yn
,	b.end_yn
,	b.rework_yn
,	b.split_yn
,	b.merge_yn
,	b.remark
,	b.create_user
,	b.create_dt
from
	dbo.erp_sdm_standard_operation a
join
	dbo.tb_model_oper_ext b	
	on a.OPERATION_CODE = b.operation_code
where
	a.OPERATION_SEQ_NO = @operation_seq_no
and	a.OPERATION_CODE = @operation_code
;