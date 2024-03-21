with cte_aoi as
(
	select
		aoi_map.operation_seq_no as oper_seq_no
	,	aoi_map.operation_code as oper_code
	,	aoi_map.job_no as workorder
	,	aoi_map.pnl_id as panel_id 
	,	cast(aoi_map.pnl_no as varchar) as panelnumber
	from
		dbo.tb_panel_aoi_mapping aoi_map
)
select  
--	aoi_map.oper_seq_no
--,	aoi_map.oper_code
	aoi_map.panel_id
,	vrs.pnlno as panel_seq
,	vrs.piece_no
from
    cte_aoi aoi_map
left join
    dbo.tb_vrs vrs
    on  vrs.workorder = aoi_map.workorder
	and	vrs.oper_seq_no = aoi_map.oper_seq_no
    and vrs.pnlno = aoi_map.panelnumber
	and vrs.piece_no != -9999
where
	vrs.piece_no is not null
--and vrs.workorder = @workorder
group by
	--aoi_map.oper_seq_no, aoi_map.oper_code, 
	aoi_map.panel_id, vrs.pnlno, vrs.piece_no
;
--with cte as
--(
--	select
--		code_oper.*
--	from
--		dbo.tb_code code_type
--	join
--		dbo.tb_code code_oper
--		on	code_type.code_id = code_oper.codegroup_id
--	where
--		code_type.codegroup_id = 'FDC_TYPE'
--	and	code_type.code_id like '%AOI%'
--), cte_item as
--(
--	select
--		item.*
--	,   isnull(lead(item.create_dt) over (partition by item.panel_group_key, item.eqp_code order by item.create_dt), item.end_dt_4m) as next_create_dt
--	from
--		dbo.fn_panel_item_by_workorder(@workorder, null) item
--	join
--		cte
--		on	item.oper_code = cte.code_id
--), cte_item_with_aoi as
--(
--	select
--		item.oper_seq_no
--	,	item.oper_code
--	,	item.panel_id
--	,	item.workorder
--	,	item.start_dt_4m
--	,	item.end_dt_4m
--	,	item.create_dt
--	,	item.next_create_dt
--	,	cast(aoi_line.PNL_NO as varchar) as panelnumber
--	--,	aoi.start_time
--	--,	aoi.row_no
--	from
--		cte_item item
--	left join
--       	dbo.erp_aoi_mapping_line aoi_line
--       	on aoi_line.PNL_ID = item.panel_id
--)
--select  
----	item_aoi.oper_seq_no
----,	item_aoi.oper_code
--	item_aoi.panel_id
--,	vrs.pnlno as panel_seq
--,	max(item_aoi.start_dt_4m) as start_dt_4m
--,	max(item_aoi.end_dt_4m) as end_dt_4m
--,	vrs.piece_no
--from
--    cte_item_with_aoi item_aoi
--left join
--    dbo.tb_vrs vrs
--    on  vrs.workorder = item_aoi.workorder
--	and	vrs.oper_seq_no = item_aoi.oper_seq_no
--    and vrs.pnlno = item_aoi.panelnumber
--	and vrs.create_dt > item_aoi.start_dt_4m
--	and vrs.piece_no != -9999
--where
--	vrs.piece_no is not null
--group by
--	--item_aoi.oper_seq_no, item_aoi.oper_code, 
--	item_aoi.panel_id, vrs.pnlno, vrs.piece_no
--;