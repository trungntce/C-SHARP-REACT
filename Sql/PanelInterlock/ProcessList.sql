select
	inter.*

,	proc_first.judge_code
,	proc_first.judge_method
,	proc_first.judge_remark
,	proc_first.judge_attach
,	proc_first.judge_user
,	judge_user.[user_name] as judge_user_name
,	proc_first.judge_dt

,	proc_first.settle_code
,	proc_first.settle_remark
,	proc_first.settle_attach
,	proc_first.settle_user
,	settle_user.[user_name] as settle_user_name
,	proc_first.settle_dt

,	proc_first.step
,	proc_first.reference_code

,	rework_first.rework_code
,	defect_first.defect_code

,	rework_first.put_remark
,	rework_first.approve_remark
,	rework_first.refuse_remark

,	defect_first.on_remark
,	defect_first.off_remark
from
	dbo.tb_panel_interlock inter
join
	dbo.tb_panel_interlock_process proc_first
	on	inter.group_key = proc_first.interlock_group_key
	and	proc_first.step = 1
left join
	dbo.tb_panel_rework rework_first
	on	proc_first.judge_code = 'R'
	and	inter.panel_interlock_id = rework_first.panel_interlock_id
left join
	dbo.tb_panel_defect defect_first
	on	proc_first.judge_code = 'D'
	and	inter.panel_interlock_id = defect_first.panel_interlock_id
left join
	dbo.tb_user judge_user
	on	proc_first.judge_user = judge_user.[user_id]
left join
	dbo.tb_user settle_user
	on	proc_first.settle_user = settle_user.[user_id]
where
	inter.group_key = @group_key
union all
select
	inter.*

,	proc_second.judge_code
,	proc_second.judge_method
,	proc_second.judge_remark
,	proc_second.judge_attach
,	proc_second.judge_user
,	judge_user.[user_name]
,	proc_second.judge_dt

,	proc_second.settle_code
,	proc_second.settle_remark
,	proc_second.settle_attach
,	proc_second.settle_user
,	settle_user.[user_name]
,	proc_second.settle_dt

,	proc_second.step
,	proc_second.reference_code

,	rework_second.rework_code
,	defect_second.defect_code

,	rework_second.put_remark
,	rework_second.approve_remark
,	rework_second.refuse_remark

,	defect_second.on_remark
,	defect_second.off_remark
from
	dbo.tb_panel_interlock inter
join
	dbo.tb_panel_interlock_process proc_second
	on	inter.group_key = proc_second.interlock_group_key
	and	proc_second.step = 2
left join
	dbo.tb_panel_rework rework_second
	on	proc_second.judge_code = 'R'
	and	inter.panel_interlock_id = rework_second.panel_interlock_id
left join
	dbo.tb_panel_defect defect_second
	on	proc_second.judge_code = 'D'
	and	inter.panel_interlock_id = defect_second.panel_interlock_id
left join
	dbo.tb_user judge_user
	on	proc_second.judge_user = judge_user.[user_id]
left join
	dbo.tb_user settle_user
	on	proc_second.settle_user = settle_user.[user_id]
where
	inter.group_key = @group_key
;