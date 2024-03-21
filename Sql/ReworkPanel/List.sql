with cte as
(
	select
		rework.corp_id
	,	rework.fac_id
	,	rework.panel_rework_id
	,	rework.oper_seq as oper_seq_no_rework
	,	rework.oper_code as oper_code_rework
	,	rework.oper_name as oper_name_rework
	,   rework.roll_id
	,	rework.panel_id
	,	rework.put_remark
	,	rework.refuse_remark
	,	rework.approve_remark
	,	rework.rework_code
	,	code.code_name as rework_name
	,	rework.put_update_user
	,	rework.refuse_update_user
	,	rework.approve_update_user
	,	rework.put_dt
	,	rework.refuse_dt
	,	rework.approve_dt

	,	put_user.[user_name] as put_user_name
	,	refuse_user.[user_name] as refuse_user_name
	,	approve_user.[user_name] as approve_user_name

	,	isnull(process_second.judge_code, process_first.judge_code) as judge_code
	,	isnull(process_second.judge_method, process_first.judge_method) as judge_method
	,	isnull(process_second.judge_remark, process_first.judge_remark) as judge_remark
	,	isnull(process_second.judge_user, process_first.judge_user) as judge_user

	,	isnull(process_second.settle_code, process_first.settle_code) as settle_code
	,	isnull(process_second.settle_remark, process_first.settle_remark) as settle_remark
	,	isnull(process_second.settle_user, process_first.settle_user) as settle_user

	,	interlock.interlock_code

	,	item.panel_group_key
	,	item.eqp_code

	,	count(*) over() as total_count
	from 
		dbo.tb_panel_rework rework
	left join 
		dbo.tb_code code
		on	rework.rework_code = code.code_id
		and code.codegroup_id = 'REWORKREASON'
	left join
		dbo.tb_user put_user
		on	rework.put_update_user = put_user.[user_id]
	left join
		dbo.tb_user refuse_user
		on	rework.refuse_update_user = refuse_user.[user_id]
	left join
		dbo.tb_user approve_user
		on	rework.approve_update_user = approve_user.[user_id]
	left join
		dbo.tb_panel_interlock interlock
		on	rework.panel_interlock_id = interlock.panel_interlock_id
	left join
		dbo.tb_panel_interlock_process process_first
		on	interlock.group_key = process_first.interlock_group_key
		and	process_first.step = 1
		and	process_first.judge_code = 'R' and process_first.settle_code = 'R'
	left join
		dbo.tb_panel_item item
		on	interlock.item_key = item.item_key
	left join
		dbo.tb_panel_interlock_process process_second
		on	interlock.group_key = process_second.interlock_group_key
		and	process_second.step = 2
		and	process_second.judge_code = 'R' and process_first.settle_code = 'R'
	where
		rework.corp_id		  	= @corp_id
	and	rework.fac_id			= @fac_id
	and	rework.roll_id			like '%' + @roll_id + '%'
	and	rework.panel_id			like '%' + @panel_id + '%'
	and rework.rework_code		like '%' + @rework_code + '%'
	and ((@approve_yn = 'C' and rework.approve_dt is null and rework.refuse_dt is null) or
		 (@approve_yn = 'A' and rework.approve_dt is not null) or
		 (@approve_yn = 'R' and rework.refuse_dt is not null))
	order by
		rework.put_dt desc
	offset 
		(@page_no - 1) * @page_size rows
	fetch next 
		@page_size rows only
), cte_4m as
(
    select
        workorder
    ,   group_key
	,	oper_code
	,	oper_seq_no
    ,   row_number() over (partition by group_key order by row_key) as row_num -- group_key 로 첫번째
    from
        dbo.tb_panel_4m
    where
        group_key in (select panel_group_key from cte)
)
select
	cte.*
,	[4m].workorder
,	isnull([4m].oper_code, cte.oper_code_rework) as oper_code
,	isnull([4m].oper_seq_no, cte.oper_seq_no_rework) as oper_seq_no
,	isnull(sdm_oper.OPERATION_DESCRIPTION, cte.oper_name_rework) as oper_name
,	judge_user.[user_name] as judge_user_name
,	isnull(concat_ws('::',sdm_oper.OPERATION_DESCRIPTION,sdm_oper_tl.OPERATION_DESCRIPTION,''),cte.oper_name_rework) as tran_oper_name
from
	cte
left join
	cte_4m [4m]
	on	cte.panel_group_key = [4m].group_key
	and	[4m].row_num = 1
left join
	dbo.erp_sdm_standard_operation sdm_oper
	on	[4m].oper_code = sdm_oper.OPERATION_CODE
join
	dbo.erp_sdm_standard_operation_tl sdm_oper_tl
	on sdm_oper.OPERATION_ID = sdm_oper_tl.OPERATION_ID
left join
	dbo.tb_user judge_user
	on	cte.judge_user = judge_user.[user_id]
;