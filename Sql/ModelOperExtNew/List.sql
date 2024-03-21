select 
	a.operation_seq_no
,	oper.OPERATION_CODE			as operation_code

,	oper.OPERATION_DESCRIPTION	as operation_desc
,	oper.WORKING_UOM			as working_uom
,	oper.ENABLED_FLAG			as enable_flag

,	isnull(a.oper_yn,			b.oper_yn)				as oper_yn
,	isnull(a.scan_eqp_yn,		b.scan_eqp_yn)			as scan_eqp_yn
,	isnull(a.scan_worker_yn,	b.scan_worker_yn)		as scan_worker_yn
,	isnull(a.scan_material_yn,	b.scan_material_yn)		as scan_material_yn
,	isnull(a.scan_tool_yn,		b.scan_tool_yn)			as scan_tool_yn
,	isnull(a.scan_panel_yn,		b.scan_panel_yn)		as scan_panel_yn
,	isnull(a.scan_type,			b.scan_type)			as scan_type
,	isnull(a.start_yn,			b.start_yn)				as start_yn
,	isnull(a.end_yn,			b.end_yn)				as end_yn
,	isnull(a.rework_yn,			b.rework_yn)			as rework_yn
,	isnull(a.split_yn,			b.split_yn)				as split_yn
,	isnull(a.merge_yn,			b.merge_yn)				as merge_yn
,	isnull(a.remark,			b.remark)				as remark

,	a.eqp_json
,	a.create_user
,	a.create_dt

,	concat_ws('::', oper.OPERATION_DESCRIPTION, oper_tl.OPERATION_DESCRIPTION,'')	as tran_lang
from
	dbo.erp_sdm_standard_operation oper
join
	dbo.erp_sdm_standard_operation_tl oper_tl
	on oper.OPERATION_ID = oper_tl.OPERATION_ID
left join
	dbo.tb_model_oper_ext a
	on	oper.OPERATION_CODE = a.operation_code
	and	a.model_code = @model_code
left join
	dbo.tb_oper_ext b
	on	oper.OPERATION_CODE  = b.operation_code
;