 with cte_vrs as
(
	select
		max(a.mesdate)		as mesdate,
		min(a.create_dt)	as create_dt,
		max(a.vendor_name)		as vendor_name,
		max(a.item_code)		as item_code,
		max(a.item_description)		as item_name,
		max(a.eqp_code)			as eqp_code,
		max(a.model_code)	as model_code,
		a.oper_seq_no,
		'' as [app_code],
		'' as [app_name],
		max(SSE.EQUIPMENT_DESCRIPTION) as [eqp_name],
		max(a.workorder) as workorder ,
		max(a.panel_qty) as panel_cnt,
		count(a.workorder) 	as ngcnt,
		isnull(sum(case a.ngcode        when 1  then 1 else 0 end), 0) as [open],
		isnull(sum(case a.ngcode        when 2  then 1 else 0 end), 0) as [short],
        isnull(sum(case a.ngcode        when 3  then 1 else 0 end), 0) as [3],
        isnull(sum(case a.ngcode        when 4  then 1 else 0 end), 0) as [4],
        isnull(sum(case a.ngcode        when 5  then 1 else 0 end), 0) as [5],
        isnull(sum(case a.ngcode        when 6  then 1 else 0 end), 0) as [6],
        isnull(sum(case a.ngcode        when 7  then 1 else 0 end), 0) as [7],
        isnull(sum(case a.ngcode        when 8  then 1 else 0 end), 0) as [8],
        isnull(sum(case a.ngcode        when 9  then 1 else 0 end), 0) as [9],
        isnull(sum(case a.ngcode        when 10 then 1 else 0 end), 0) as [10],
        isnull(sum(case a.ngcode        when 11 then 1 else 0 end), 0) as [11],
        isnull(sum(case a.ngcode        when 12 then 1 else 0 end), 0) as [12],
        isnull(sum(case a.ngcode        when 13 then 1 else 0 end), 0) as [13],
        isnull(sum(case a.ngcode        when 14 then 1 else 0 end), 0) as [14],
        isnull(sum(case a.ngcode        when 15 then 1 else 0 end), 0) as [15],
        isnull(sum(case a.ngcode        when 16 then 1 else 0 end), 0) as [16],
        isnull(sum(case a.ngcode        when 17 then 1 else 0 end), 0) as [17],
        isnull(sum(case a.ngcode        when 18 then 1 else 0 end), 0) as [18],
        isnull(sum(case a.ngcode        when 19 then 1 else 0 end), 0) as [19],
        isnull(sum(case a.ngcode        when 20 then 1 else 0 end), 0) as [20],
        isnull(sum(case a.ngcode        when 21 then 1 else 0 end), 0) as [21],
        isnull(sum(case a.ngcode        when 22 then 1 else 0 end), 0) as [22],
        isnull(sum(case a.ngcode        when 23 then 1 else 0 end), 0) as [23],
        isnull(sum(case a.ngcode        
        			when 24 then 1 
        			when 25 then 1
        			when 26 then 1
        			when 27 then 1
        			when 28 then 1
        			when 29 then 1
        			when 30 then 1
        			when 31 then 1
        			when 32 then 1
        			else 0 end), 0) as [24]
	from
		dbo.tb_vrs a 
	join 
		tb_code b
		on b.codegroup_id = 'VRS_NG_CODE'
		and b.code_id 		= a.ngcode 
	left join 
		erp_sdm_standard_equipment SSE 
		on SSE.EQUIPMENT_CODE = a.eqp_code
	where
		a.corp_id = @corp_id
	and a.fac_id = @fac_id
	and a.create_dt >= @from_dt and a.create_dt < @to_dt
	and a.eqp_code = @eqp_code
	and a.vendor_code = @vendor_code
	and a.item_code = @item_code
	and a.item_description like '%' + @item_name + '%'
	and a.workorder like '%' + @workorder + '%'
	and	model_code = @model_code
	group by
		case when @groupby = 'EQP' then a.eqp_code end
	,	case when @groupby != 'EQP' then a.vendor_code end
	,	case when @groupby != 'EQP' and (@groupby = 'ITEM' or @groupby = 'MODEL' or @groupby = 'LOT') then a.item_code end
	,	case when @groupby != 'EQP' and (@groupby = 'MODEL' or @groupby = 'LOT') then a.model_code end
	,	case when @groupby != 'EQP' and  @groupby = 'LOT' then a.workorder end
	,	a.oper_seq_no
), cte_vrs_ng as 
(
	select
		vrs.workorder
	,	vrs.oper_seq_no
	,	vrs.pnlno
	,	vrs.piece_no
	,	max(vrs.panel_qty) as panel_qty
	from
		dbo.tb_vrs vrs
	join
		dbo.tb_code code
		on	vrs.ngcode = code.code_id
		and	code.codegroup_id = 'VRS_NG_CODE'
	where
		vrs.piece_no is not null
	and vrs.piece_no != '-9999'
	and	vrs.corp_id = @corp_id
	and vrs.fac_id = @fac_id
	and vrs.create_dt >= @from_dt and vrs.create_dt < @to_dt
	and vrs.eqp_code = @eqp_code
	and vrs.vendor_code = @vendor_code
	and vrs.item_code = @item_code
	and vrs.item_description like '%' + @item_name + '%'
	and vrs.workorder like '%' + @workorder + '%'
	and	model_code = @model_code
	group by
		case when @groupby = 'EQP' then vrs.eqp_code end
	,	case when @groupby != 'EQP' then vrs.vendor_code end
	,	case when @groupby != 'EQP' and (@groupby = 'ITEM' or @groupby = 'MODEL' or @groupby = 'LOT') then vrs.item_code end
	,	case when @groupby != 'EQP' and (@groupby = 'MODEL' or @groupby = 'LOT') then vrs.model_code end
	,	case when @groupby != 'EQP' and  @groupby = 'LOT' then vrs.workorder end
	,	vrs.workorder, vrs.oper_seq_no, vrs.pnlno, vrs.piece_no
), cte_ng as 
(
	select 
		workorder
	,	oper_seq_no
	,	max(panel_qty) as panel_qty
	,	count(piece_no) as ng_pcs_total
	from 
		cte_vrs_ng
	group by 
		workorder, oper_seq_no
), cte_ng_total as 
(
	select 
		cte_ng.ng_pcs_total
	,	cte_ng.panel_qty * spec.PCS_PER_PNL_QTY as pcs_total
	,	cte_ng.ng_pcs_total * 100 / (cte_ng.panel_qty * spec.PCS_PER_PNL_QTY) as ng_rate
	,	cte_ng.oper_seq_no
	,	cte_ng.workorder
	from 
		cte_ng
	join 
		dbo.erp_wip_job_entities job
		on	job.JOB_NO = cte_ng.workorder
	join
		dbo.erp_sdm_item_spec spec
		on	spec.BOM_ITEM_ID = job.BOM_ITEM_ID
	where
		cte_ng.panel_qty * spec.PCS_PER_PNL_QTY > 0
)
select 
	cte_vrs.*
,	cte_ng_total.pcs_total
,	cte_ng_total.ng_pcs_total
,	cte_ng_total.ng_rate
from 
	cte_vrs
left join
	cte_ng_total
	on cte_vrs.workorder = cte_ng_total.workorder
	and cte_vrs.oper_seq_no = cte_ng_total.oper_seq_no
;