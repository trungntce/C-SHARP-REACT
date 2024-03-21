with cte_erp_job as 
(
	select
		WJE.JOB_NO
	,	WJE.CREATION_DATE
	,	SIR.BOM_ITEM_CODE
	,	SIR.BOM_ITEM_DESCRIPTION
	,	WMT.OPERATION_SEQ_NO
	,	SSO.OPERATION_ID
	,	SSO.OPERATION_CODE
	,	SSO.OPERATION_DESCRIPTION
	,	SSW.WORKCENTER_CODE
	,	SSW.WORKCENTER_DESCRIPTION
	,	SRE.RESOURCE_CODE
	,	SRE.RESOURCE_DESCRIPTION
	,	SSE.EQUIPMENT_CODE 
	,	SSE.EQUIPMENT_DESCRIPTION 
	,	concat_ws('::', SSO.OPERATION_DESCRIPTION, oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_name
	,	IIM.ITEM_CODE
	,	IIM.ITEM_DESCRIPTION
	from
		erp_wip_move_trx_eqp WMT
		left join dbo.erp_wip_job_entities				WJE on WJE.JOB_ID = WMT.JOB_ID 
		left join dbo.erp_sdm_item_revision				SIR on SIR.BOM_ITEM_ID = WJE.BOM_ITEM_ID 
		left join dbo.erp_sdm_standard_operation		SSO on SSO.OPERATION_ID = WMT.OPERATION_ID 
	    left join dbo.erp_sdm_standard_resource			SRE on SRE.RESOURCE_ID = WMT.RESOURCE_ID 
	    left join dbo.erp_sdm_standard_workcenter		SSW on SSW.WORKCENTER_ID = WMT.WORKCENTER_ID 
	    left join dbo.erp_sdm_standard_equipment		SSE on SSE.EQUIPMENT_ID = WMT.EQUIPMENT_ID 
		join	  dbo.erp_sdm_standard_operation_tl oper_tl on SSO.OPERATION_ID = oper_tl.OPERATION_ID
		left join dbo.erp_inv_item_master				IIM on IIM.INVENTORY_ITEM_ID = WJE.INVENTORY_ITEM_ID
	where
		WMT.CANCEL_RUN_END_FLAG != 'Y'
	and SIR.SOB_ID       = 90
	and SIR.ORG_ID       = 901
	and SIR.ENABLED_FLAG = 'Y'
	and SSO.ENABLED_FLAG = 'Y'
	and SRE.ENABLED_FLAG = 'Y'
	and SSW.ENABLED_FLAG = 'Y'
	and WMT.CREATION_DATE >= @from_dt and WMT.CREATION_DATE < @to_dt
	and SIR.BOM_ITEM_CODE = @model_code
	and SSW.WORKCENTER_CODE = @workcenter_code
	and SSE.EQUIPMENT_CODE = @eqp_code
	and WJE.JOB_NO like '%' + @workorder + '%'
	and IIM.ITEM_CODE = @item_code
), cte_mes_eqp as 
(
	select
		distinct equip as eqp_code
	from
		raw_pc_infotable
	where
		main = 'y'
	and roomname not in ('vrs', 'Sensor')
	union all
	select
		eqcode as eqp_code
	from
		raw_plcsymbol_infotable
	where 
		roomname not in ('PLASMA')
	group by
		eqcode
), cte_eqp as 
(
	select 
		cte_erp_job.*
	from 
		cte_erp_job
	join 
		cte_mes_eqp
		on cte_mes_eqp.eqp_code = cte_erp_job.EQUIPMENT_CODE
), cte_4m as 
(
	select
		[4m].workorder
	,	[4m].model_code 
	,	[4m].oper_seq_no
	,	[4m].oper_code 
	,	[4m].eqp_code 
	,	[4m].create_dt 
	,	[4m].start_dt 
	,	[4m].end_dt
	,	[4m].qty
	,	pnl_worker.worker_code as pnl_worker_code
	,	pnl_worker.worker_name as pnl_worker_name
	,	rework_worker.worker_code as rework_worker_code
	,	rework_worker.worker_name as rework_worker_name
	,	case 
			when pnl_worker.worker_code is null and rework_worker.worker_code is null 
				then 1 
			when pnl_worker.worker_code is null 
				then row_number() over(partition by rework_worker.row_key order by rework_worker.row_no) 
        	else row_number() over(partition by pnl_worker.row_key order by pnl_worker.row_no) 
        end as worker_row
	from
		dbo.tb_panel_4m [4m]
	left join 
        dbo.tb_panel_worker pnl_worker
        on pnl_worker.row_key = [4m].row_key
	left join 
		dbo.tb_panel_worker_rework_initial rework_worker
		on rework_worker.row_key = [4m].row_key
	where 
		1=1
	and [4m].workorder in (select JOB_NO from cte_eqp group by JOB_NO)
	and [4m].model_code = @model_code
	and [4m].eqp_code = @eqp_code
	and [4m].workorder like '%' + @workorder + '%'
), cte_num as 
(
	select 
		*
	from 
		cte_4m
	where 
		worker_row = 1
), cte_total as 
(
	select
		cte_eqp.*
	,	qty
	,	start_dt
	,	end_dt
	,	case when start_dt is null and end_dt is null then 'NG'
			when start_dt is not null and end_dt is null then 'RUN'
			else 'END' end as ng_judge
	,	case when start_dt is null and end_dt is null then 1
			when start_dt is not null and end_dt is null then 0
			else 0 end ng_cnt
	,	isnull(pnl_worker_code, rework_worker_code) as worker_code
	,	isnull(pnl_worker_name, rework_worker_name) as worker_name
	,	cte_num.model_code as model_mes
	,	cte_eqp.BOM_ITEM_CODE as model_erp
	,	msg.remark as [4m_msg]
	,	ITEM_CODE as item_code
	,	ITEM_DESCRIPTION as item_name
	from
		cte_eqp
	left join
		cte_num
		on cte_num.workorder = cte_eqp.JOB_NO
		--and cte_num.model_code = cte_eqp.BOM_ITEM_CODE
		and cte_num.oper_seq_no = cte_eqp.OPERATION_SEQ_NO
		and cte_num.oper_code = cte_eqp.OPERATION_CODE
		--and cte_num.eqp_code = cte_eqp.EQUIPMENT_CODE -- ERP 는 키인이기에 설비코드는 조인은 제거
	left join 
		tb_panel_4m_result msg
		on msg.workorder = cte_eqp.JOB_NO
		and msg.oper_seq_no = cte_eqp.OPERATION_SEQ_NO
		and msg.remark like '%[NG]%'
)        
select
	JOB_NO
,	model_mes
,	model_erp
,	item_code
,	max(item_name) as item_name
,	max(BOM_ITEM_DESCRIPTION) as BOM_ITEM_DESCRIPTION
,	OPERATION_SEQ_NO
,	OPERATION_CODE
,	max(OPERATION_DESCRIPTION) as OPERATION_DESCRIPTION
,	tran_oper_name
,	WORKCENTER_CODE
,	max(WORKCENTER_DESCRIPTION) as WORKCENTER_DESCRIPTION
,	EQUIPMENT_CODE
,	max(EQUIPMENT_DESCRIPTION) as EQUIPMENT_DESCRIPTION
,	qty
,	ng_judge
,	ng_cnt
,	min(start_dt) as start_dt
,	min(end_dt) as end_dt
,	worker_code
,	max(worker_name) as worker_name
,	[4m_msg]
from
	cte_total
where -- uv laser #1 ~#11, IRP, tunnel, roll, Horizontal, HP(2공장 동아 #1 ~ #27), 블랙홀 1호기(M-184-01-V001), RTR 동도금 1호기(M-108-01-V001), D-Sided Roll Wet  Laminator(M-190-01-V001)
	1=1
and cte_total.EQUIPMENT_CODE not in (select eqp_code from tb_eqp_4m_exc)
and cte_total.OPERATION_CODE not in ('G05020')
and ng_judge = @status
group by 
	JOB_NO, model_mes, model_erp, item_code, OPERATION_SEQ_NO, OPERATION_CODE, tran_oper_name, WORKCENTER_CODE, EQUIPMENT_CODE, qty, ng_judge, ng_cnt, worker_code, [4m_msg]
order by
	JOB_NO, OPERATION_SEQ_NO, EQUIPMENT_CODE
