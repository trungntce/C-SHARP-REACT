with cte as
(
	select
		defect.corp_id
	,	defect.fac_id
	,	defect.roll_id
	,	defect.panel_id
	,	defect.panel_defect_id
	,	defect.on_remark
	,	defect.off_remark
	,	defect.auto_yn
	,	defect.defect_code
	,	code.code_name as defect_name
	,	defect.on_update_user
	,	defect.off_update_user
	,	defect.on_dt
	,	defect.off_dt

	,	on_user.[user_name] as on_user_name
	,	off_user.[user_name] as off_user_name

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
		dbo.tb_panel_defect defect
	left join 
		dbo.tb_code code
		on	defect.defect_code = code.code_id
		and code.codegroup_id = 'DEFECTREASON'
	left join
		dbo.tb_user on_user
		on	defect.on_update_user = on_user.[user_id]
	left join
		dbo.tb_user off_user
		on	defect.off_update_user = off_user.[user_id]
	left join
		dbo.tb_panel_interlock interlock
		on	defect.panel_interlock_id = interlock.panel_interlock_id
	left join
		dbo.tb_panel_interlock_process process_first
		on	interlock.group_key = process_first.interlock_group_key
		and	process_first.step = 1
		and	process_first.judge_code = 'D' and process_first.settle_code = 'D'
	left join
		dbo.tb_panel_item item
		on	interlock.item_key = item.item_key
	left join
		dbo.tb_panel_interlock_process process_second
		on	interlock.group_key = process_second.interlock_group_key
		and	process_second.step = 2
		and	process_second.judge_code = 'D' and process_first.settle_code = 'D'
	where
		defect.corp_id		  	 = @corp_id
	and	defect.fac_id			 = @fac_id
	and	defect.panel_id			like '%' + @panel_id + '%'
	and defect.defect_code		like '%' + @defect_code + '%'
	order by
		defect.on_dt desc
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
,	[4m].oper_code
,	[4m].oper_seq_no
,	sdm_oper.OPERATION_DESCRIPTION as oper_name
,	judge_user.[user_name] as judge_user_name
,	concat_ws('::', sdm_oper.OPERATION_DESCRIPTION, sdm_oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_name
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
	on 	    sdm_oper.OPERATION_ID = sdm_oper_tl.OPERATION_ID  
left join
	dbo.tb_user judge_user
	on	cte.judge_user = judge_user.[user_id]
;
