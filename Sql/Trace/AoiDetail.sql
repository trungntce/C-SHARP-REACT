with cte_aoi as
(
	select
		aoi_map.operation_seq_no as oper_seq_no
	,	aoi_map.operation_code as oper_code
	,	aoi_map.job_no as workorder
	,	aoi_map.pnl_id as panel_id 
	,	cast(aoi_map.pnl_no as varchar) as panelnumber
	,	sis.PCS_PER_PNL_QTY as pcs_num
	from
		dbo.tb_panel_aoi_mapping aoi_map
	join 
		dbo.erp_sdm_item_spec sis
		on sis.BOM_ITEM_ID = aoi_map.bom_item_id 
	where 
        1=1
	and aoi_map.pnl_id = @panel_id
), cte_ng_pnl as 
(
	select  
		aoi_map.oper_seq_no
	,	aoi_map.panel_id
	,	vrs.pnlno as panel_seq
	,	vrs.piece_no
	,	max(vrs.workorder) as workorder 
	,	vrs.layer
	from
	    cte_aoi aoi_map
	left join
	    dbo.tb_vrs vrs
	    on  vrs.workorder = aoi_map.workorder
		and	vrs.oper_seq_no = aoi_map.oper_seq_no
	    and vrs.pnlno = aoi_map.panelnumber
--		and vrs.create_dt > aoi_map.start_dt_4m
		and vrs.piece_no != -9999
	where
		vrs.piece_no is not null
	group by
		aoi_map.panel_id, vrs.pnlno, vrs.piece_no, aoi_map.oper_seq_no, vrs.layer
), cte_ng_pcs as
(
        select
                vrs.workorder
        ,       vrs.pnlno
        ,       vrs.layer
        ,       vrs.piece_no
        ,       count(vrs.piece_no) as ng_piece
        ,       vrs.oper_seq_no
        from
                tb_vrs vrs
        left join
        	cte_ng_pnl
        	on cte_ng_pnl.workorder = vrs.workorder
        	and cte_ng_pnl.oper_seq_no = vrs.oper_seq_no
        	and cte_ng_pnl.layer = vrs.layer
        	and cte_ng_pnl.piece_no = vrs.piece_no
        	and cte_ng_pnl.panel_seq = vrs.pnlno
        where
                vrs.workorder = @workorder
        and vrs.oper_seq_no = @oper_seq_no
        and vrs.piece_no is not null
        and vrs.piece_no != '-9999'
        and cte_ng_pnl.panel_id = @panel_id
        group by
                vrs.pnlno, vrs.workorder, vrs.layer, vrs.oper_seq_no, vrs.piece_no
), cte_ng_total as
(
        select
                workorder
        ,       layer
        ,       count(piece_no) as aoi_ng_pcs
        ,       max(oper_seq_no) as oper_seq_no
        from
                cte_ng_pcs
        group by
                workorder, layer
), cte_defect as
(
        select
                vrs.workorder
        ,       vrs.layer
        ,       vrs.oper_seq_no
        ,       count(vrs.ngcode) as defect_cnt
        ,       isnull(sum(case vrs.ngcode  when 0  then 1 else 0 end), 0) as [defect_0]
        ,       isnull(sum(case vrs.ngcode  when 1  then 1 else 0 end), 0) as [defect_1]
        ,       isnull(sum(case vrs.ngcode  when 2  then 1 else 0 end), 0) as [defect_2]
        ,       isnull(sum(case vrs.ngcode  when 3  then 1 else 0 end), 0) as [defect_3]
        ,       isnull(sum(case vrs.ngcode  when 4  then 1 else 0 end), 0) as [defect_4]
        ,       isnull(sum(case vrs.ngcode  when 5  then 1 else 0 end), 0) as [defect_5]
        ,       isnull(sum(case vrs.ngcode  when 6  then 1 else 0 end), 0) as [defect_6]
        ,       isnull(sum(case vrs.ngcode  when 7  then 1 else 0 end), 0) as [defect_7]
        ,       isnull(sum(case vrs.ngcode  when 8  then 1 else 0 end), 0) as [defect_8]
        ,       isnull(sum(case vrs.ngcode  when 9  then 1 else 0 end), 0) as [defect_9]
        ,       isnull(sum(case vrs.ngcode  when 10 then 1 else 0 end), 0) as [defect_10]
        ,       isnull(sum(case vrs.ngcode  when 11 then 1 else 0 end), 0) as [defect_11]
        ,       isnull(sum(case vrs.ngcode  when 12 then 1 else 0 end), 0) as [defect_12]
        ,       isnull(sum(case vrs.ngcode  when 13 then 1 else 0 end), 0) as [defect_13]
        ,       isnull(sum(case vrs.ngcode  when 14 then 1 else 0 end), 0) as [defect_14]
        ,       isnull(sum(case vrs.ngcode  when 15 then 1 else 0 end), 0) as [defect_15]
        ,       isnull(sum(case vrs.ngcode  when 16 then 1 else 0 end), 0) as [defect_16]
        ,       isnull(sum(case vrs.ngcode  when 17 then 1 else 0 end), 0) as [defect_17]
        ,       isnull(sum(case vrs.ngcode  when 18 then 1 else 0 end), 0) as [defect_18]
        ,       isnull(sum(case vrs.ngcode  when 19 then 1 else 0 end), 0) as [defect_19]
        ,       isnull(sum(case vrs.ngcode  when 20 then 1 else 0 end), 0) as [defect_20]
        ,       isnull(sum(case vrs.ngcode  when 21 then 1 else 0 end), 0) as [defect_21]
        ,       isnull(sum(case vrs.ngcode  when 22 then 1 else 0 end), 0) as [defect_22]
        ,       isnull(sum(case vrs.ngcode  when 23 then 1 else 0 end), 0) as [defect_23]
        ,       isnull(sum(case vrs.ngcode  when 24 then 1 else 0 end), 0) as [defect_24]
        ,       isnull(sum(case vrs.ngcode  when 25 then 1 else 0 end), 0) as [defect_25]
        ,       isnull(sum(case vrs.ngcode  when 26 then 1 else 0 end), 0) as [defect_26]
        ,       isnull(sum(case vrs.ngcode  when 27 then 1 else 0 end), 0) as [defect_27]
        ,       isnull(sum(case vrs.ngcode  when 28 then 1 else 0 end), 0) as [defect_28]
        ,       isnull(sum(case vrs.ngcode  when 29 then 1 else 0 end), 0) as [defect_29]
        ,       isnull(sum(case vrs.ngcode  when 30 then 1 else 0 end), 0) as [defect_30]
        ,       isnull(sum(case vrs.ngcode  when 31 then 1 else 0 end), 0) as [defect_31]
        ,       isnull(sum(case vrs.ngcode  when 32 then 1 else 0 end), 0) as [defect_32]
        ,       isnull(sum(case vrs.ngcode  when 33 then 1 else 0 end), 0) as [defect_33]
        from
                tb_vrs vrs
        left join
        	cte_ng_pnl
        	on cte_ng_pnl.workorder = vrs.workorder
        	and cte_ng_pnl.oper_seq_no = vrs.oper_seq_no
        	and cte_ng_pnl.layer = vrs.layer
        	and cte_ng_pnl.piece_no = vrs.piece_no
        	and cte_ng_pnl.panel_seq = vrs.pnlno
        where
                vrs.workorder = @workorder
        and vrs.oper_seq_no = @oper_seq_no
        and cte_ng_pnl.panel_id = @panel_id
        group by
                vrs.workorder, vrs.layer, vrs.oper_seq_no
)
select
        cte_ng_total.aoi_ng_pcs
,       cte_defect.*
from
        cte_ng_total
join
        cte_defect
        on cte_defect.workorder = cte_ng_total.workorder
        and cte_defect.layer = cte_ng_total.layer
        and cte_defect.oper_seq_no = cte_ng_total.oper_seq_no
;