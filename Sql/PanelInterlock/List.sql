with cte as
(
	select
		inter.*

	,	proc_first.judge_code as judge_code_first
	,	proc_first.judge_method as judge_method_first
	,	proc_first.judge_remark as judge_remark_first
	,	proc_first.settle_code as settle_code_first
	,	proc_first.settle_remark as settle_remark_first

	,	rework_first.rework_code as rework_code_first
	,	rework_first.refuse_dt as rework_refust_dt_first
	,	rework_first.approve_dt as rework_approve_dt_first

	,	defect_first.defect_code as defect_code_first
	,	defect_first.off_dt as defect_off_dt_first

	,	proc_first.reference_code as reference_code_first
	,	proc_first.reference_id as reference_id_first

	,	proc_second.judge_code as judge_code_second
	,	proc_second.judge_method as judge_method_second
	,	proc_second.judge_remark as judge_remark_second
	,	proc_second.settle_code as settle_code_second
	,	proc_second.settle_remark as settle_remark_second

	,	rework_second.rework_code as rework_code_second
	,	rework_second.refuse_dt as rework_refust_dt_second
	,	rework_second.approve_dt as rework_approve_dt_second

	,	defect_second.defect_code as defect_code_second
	,	defect_second.off_dt as defect_off_dt_second

	,	proc_second.reference_code as reference_code_second
	,	proc_second.reference_id as reference_id_second

	,	item.panel_group_key
	,	item.eqp_code
	from
		dbo.tb_panel_interlock inter
	left join	
		dbo.tb_panel_item item
		on	inter.item_key = item.item_key
		and inter.panel_id = item.panel_id
	left join
		dbo.tb_panel_interlock_process proc_first
		on	inter.panel_interlock_id = proc_first.panel_interlock_id
		and	proc_first.step = 1
	left join
		dbo.tb_panel_rework rework_first
		on	proc_first.judge_code = 'R'
		and	proc_first.reference_id = rework_first.panel_rework_id
	left join
		dbo.tb_panel_defect defect_first
		on	proc_first.judge_code = 'D'
		and	proc_first.reference_id = defect_first.panel_defect_id
	left join
		dbo.tb_panel_interlock_process proc_second
		on	inter.panel_interlock_id = proc_second.panel_interlock_id
		and	proc_second.step = 2
	left join
		dbo.tb_panel_rework rework_second
		on	proc_second.judge_code = 'R'
		and	proc_second.reference_id = rework_second.panel_rework_id
	left join
		dbo.tb_panel_defect defect_second
		on	proc_second.judge_code = 'D'
		and	proc_second.reference_id = defect_second.panel_defect_id
	where
		inter.corp_id = @corp_id
	and inter.fac_id = @fac_id
	and	
	(
		(@from_to_dt_type = 'I' and inter.on_dt between @from_dt and @to_dt)
		or
		(@from_to_dt_type = 'P' and item.create_dt between @from_dt and @to_dt)
	)
	and	interlock_code = @interlock_code
	and inter.auto_yn = @auto_yn
	and	proc_first.judge_code = @judge_code_first
	and	proc_second.judge_code = @judge_code_second
	and	item.eqp_code = @eqp_code
	and item.panel_group_key in (select group_key from dbo.tb_panel_4m where model_code = @model_code)
	and item.panel_group_key in (select group_key from dbo.tb_panel_4m where oper_code = @oper_code)
	and item.panel_group_key in (select group_key from dbo.tb_panel_4m where workorder = @workorder)
	and inter.panel_id like '%' + @panel_id + '%'
), cte_4m as
(
    select
        *
    ,   row_number() over (partition by group_key order by row_key) as row_num -- group_key 로 첫번째
    from
        dbo.tb_panel_4m
    where
        group_key in (select panel_group_key from cte)
)
select
	row_number() over (order by cte.on_dt desc) as row_no
,	cte.*
,	realtime.workorder as workorder
,	realtime.interlock_yn

,	[4m].workorder as workorder_4m
,	[4m].model_code
,	[4m].oper_seq_no
,	[4m].oper_code
,	sdm_oper.OPERATION_DESCRIPTION as oper_name
,	[4m].start_dt
,	[4m].end_dt

,	on_user.[user_name] as on_user_name
,	off_user.[user_name] as off_user_name
from
	cte
left join
	dbo.tb_panel_realtime realtime
	on	cte.panel_id = realtime.panel_id
left join
	cte_4m [4m]
	on	cte.panel_group_key = [4m].group_key
	and [4m].row_num = 1
left join
	dbo.erp_sdm_standard_operation sdm_oper
	on	[4m].oper_code = sdm_oper.OPERATION_CODE
left join
	dbo.tb_user on_user
	on	cte.on_update_user = on_user.[user_id]
left join
	dbo.tb_user off_user
	on	cte.off_update_user = off_user.[user_id]
order by
	cte.on_dt desc
;