select
	proc_first.interlock_group_key as group_key
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
from
	dbo.tb_panel_interlock_process proc_first
left join
	dbo.tb_user judge_user
	on	proc_first.judge_user = judge_user.[user_id]
left join
	dbo.tb_user settle_user
	on	proc_first.settle_user = settle_user.[user_id]
where
	proc_first.interlock_group_key = @group_key
and	proc_first.step = 1
union all
select
	proc_second.interlock_group_key
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
from
	dbo.tb_panel_interlock_process proc_second
left join
	dbo.tb_user judge_user
	on	proc_second.judge_user = judge_user.[user_id]
left join
	dbo.tb_user settle_user
	on	proc_second.settle_user = settle_user.[user_id]
where
	proc_second.interlock_group_key = @group_key
and	proc_second.step = 2
;