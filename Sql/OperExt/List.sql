select 
	a.OPERATION_CODE		as operation_code
,	a.OPERATION_DESCRIPTION as operation_desc
,	concat_ws('::', a.OPERATION_DESCRIPTION, sdm_oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_name	
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
	dbo.erp_sdm_standard_operation_tl sdm_oper_tl
	on a.OPERATION_ID = sdm_oper_tl.OPERATION_ID 
left join
	dbo.tb_oper_ext b	
	on a.OPERATION_CODE  = b.operation_code
where
	1=1
and	a.OPERATION_CODE			= @operation_code
and	a.OPERATION_DESCRIPTION		like '%' + @operation_desc + '%'
and	a.WORKING_UOM				= @working_uom
and a.ENABLED_FLAG				= @enable_flag
and b.remark					like '%' + @remark + '%'
and ((@setup_yn = 'Y' and b.create_user is not null) or (@setup_yn = 'N' and b.create_user is null))
order by
	a.CREATION_DATE asc
;