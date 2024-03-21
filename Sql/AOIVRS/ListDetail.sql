with cte as
(
   select 
		aoi_map.job_no as workorder
	,	cast(aoi_map.pnl_no as varchar) as panelnumber
	,	aoi_map.pnl_id as panel_id
	,	aoi_map.operation_seq_no as oper_seq_no
	from 
		dbo.tb_panel_aoi_mapping aoi_map
)
select  
    cte.panel_id
,   vrs.*
, 	b.code_name as ng_name
from
    dbo.tb_vrs vrs
left join
    cte
    on  vrs.workorder = cte.workorder
    and vrs.pnlno = cte.panelnumber
	and vrs.oper_seq_no = cte.oper_seq_no
join tb_code b
	on b.codegroup_id = 'VRS_NG_CODE'
	and b.code_id 		= vrs.ngcode 
where
    vrs.create_dt >= @from_dt and vrs.create_dt < @to_dt
and vrs.workorder like '%' + @workorder + '%'
and vrs.model_code = @model_code
and vrs.pnlno = @panel
and b.code_name like '%' + @ng_name + '%'
order by 
	cte.panel_id desc, vrs.create_dt desc
;

--with cte as
--(
--   select 
--		aoi_header.JOB_NO as workorder
--	,	cast(aoi_line.PNL_NO as varchar) as panelnumber
--	,	aoi_line.PNL_ID as panel_id
--	from 
--		dbo.erp_aoi_mapping_header aoi_header
--	join
--		dbo.erp_aoi_mapping_line aoi_line
--		on aoi_line.AOI_MAPPING_HEADER_ID = aoi_header.AOI_MAPPING_HEADER_ID
--)
--select  
--    cte.panel_id
--,   vrs.*
--, 	b.code_name as ng_name
--from
--    dbo.tb_vrs vrs
--left join
--    cte
--    on  vrs.workorder = cte.workorder
--    and vrs.pnlno = cte.panelnumber
--left join tb_code b
--  on b.codegroup_id = 'VRS_NG_CODE'
-- and b.code_id 		= vrs.ngcode 
--where
--    vrs.create_dt >= @from_dt and vrs.create_dt < @to_dt
--    and vrs.workorder like '%' + @workorder + '%'
--	and vrs.model_code = @model_code
--	and vrs.pnlno = @panel
--	and b.code_name like '%' + @ng_name + '%'
--order by cte.panel_id desc, vrs.create_dt desc
--;