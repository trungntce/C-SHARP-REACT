declare @tbl_ignore_param table
(
	panel_interlock_id	int
,	roll_id				varchar(50)
,	panel_id			varchar(50)
,	item_key			varchar(30)
,	interlock_code		varchar(40)
,	auto_yn				char(1)
,	on_remark			nvarchar(1024)
,	off_remark			nvarchar(1024)
,	on_update_user		varchar(40)
,	off_update_user		varchar(40)
,	on_dt				datetime
,	off_dt				datetime
,	group_key			varchar(32)
,	row_key				varchar(30)
,	workorder			varchar(50)
,	oper_seq_no			int
,	oper_code			varchar(30)
,	model_code			varchar(50)
,	start_dt_4m			datetime
,	end_dt_4m			datetime
,	panel_group_key		varchar(30)
,	eqp_code			varchar(30)
,	create_dt			datetime
,	recipe_judge		char(1)
,	param_judge			char(1)
,	spc_judge			char(1)
,	qtime_lock			char(1)
,	chem_judge			char(1)
,	workorder_real		varchar(50)
,	interlock_yn		char(1)
);

insert into
	@tbl_ignore_param
select
	inter.panel_interlock_id	
,	inter.roll_id				
,	inter.panel_id			
,	inter.item_key			
,	inter.interlock_code		
,	inter.auto_yn				
,	inter.on_remark			
,	inter.off_remark			
,	inter.on_update_user		
,	inter.off_update_user		
,	inter.on_dt				
,	inter.off_dt				
,	inter.group_key			

,	[4m].row_key
,	[4m].workorder
,	[4m].oper_seq_no
,	[4m].oper_code
,	[4m].model_code
,	[4m].start_dt as start_dt_4m
,	[4m].end_dt as end_dt_4m

,	item.panel_group_key
,	item.eqp_code
,	item.create_dt
,	item.recipe_judge
,	item.param_judge
,	item.spc_judge
,	item.qtime_lock
,	item.chem_judge

,	[real].workorder as workorder_real
,	[real].interlock_yn
from
	dbo.tb_panel_interlock inter
join
	dbo.tb_panel_item item
	on	inter.item_key = item.item_key
join
	dbo.tb_panel_realtime [real]
	on item.panel_id = [real].panel_id
cross apply
(
	select top 1
		*
	from
		dbo.tb_panel_4m
	where
		group_key = panel_group_key
) [4m]
where
	item.corp_id = @corp_id
and	item.fac_id = @fac_id
and	inter.on_dt >= @from_date
;

with cte as
(
	select * from @tbl_ignore_param
), cte_union as
(
	select
		null as group_key

	,	panel_group_key
	,	row_key as panel_row_key
	,	workorder
	,	oper_seq_no
	,	oper_code
	,	model_code
	,	eqp_code
	,	max(start_dt_4m) as start_dt_4m
	,	max(end_dt_4m) as end_dt_4m
	,	interlock_code
	,	min(panel_id) as min_panel_id
	,	max(on_dt) as max_on_dt
	,	count(*) as panel_cnt
	,	
	(
		select
			panel_interlock_id as id
		,	panel_id
		,	item_key
		,	create_dt

		,	recipe_judge
		,	param_judge
		,	spc_judge
		,	qtime_lock
		,	chem_judge

		,	workorder_real
		,	interlock_yn
		from
			cte agg
		where
			agg.group_key is null
		and	agg.workorder = cte.workorder
		and	agg.oper_seq_no = cte.oper_seq_no
		and	agg.model_code = cte.model_code
		and	agg.eqp_code = cte.eqp_code
		and	agg.interlock_code = cte.interlock_code
		order by
			panel_id
		for json path
	) as panel_json
	from
		cte
	where
		group_key is null
	group by
		panel_group_key, row_key, workorder, oper_seq_no, oper_code, model_code, eqp_code, interlock_code
	union all
	select
		group_key

	,	panel_group_key
	,	row_key as panel_row_key
	,	workorder
	,	oper_seq_no
	,	oper_code
	,	model_code
	,	eqp_code
	,	max(start_dt_4m) as start_dt_4m
	,	max(end_dt_4m) as end_dt_4m
	,	interlock_code
	,	min(panel_id) as min_panel_id
	,	max(on_dt) as max_on_dt
	,	count(*) as panel_cnt
	,	
	(
		select
			panel_interlock_id as id
		,	panel_id
		,	item_key
		,	create_dt

		,	recipe_judge
		,	param_judge
		,	spc_judge
		,	qtime_lock
		,	chem_judge

		,	workorder_real
		,	interlock_yn
		from
			cte agg
		where
			agg.group_key is not null
		and	agg.workorder = cte.workorder
		and	agg.oper_seq_no = cte.oper_seq_no
		and	agg.model_code = cte.model_code
		and	agg.eqp_code = cte.eqp_code
		and	agg.interlock_code = cte.interlock_code
		order by
			panel_id
		for json path
	) as panel_json
	from
		cte
	where
		group_key is not null
	group by
		panel_group_key, row_key, group_key, workorder, oper_seq_no, oper_code, model_code, eqp_code, interlock_code
), cte_last as (
(select
	case
		when 
			left(interlock_code, 4) = '5103' then '5003'
		else
			left(interlock_code, 4)
	end as interlock_major_code

,	proc_first.judge_code as judge_code_first
,	proc_first.settle_code as settle_code_first
,	proc_second.judge_code as judge_code_second
,	proc_second.settle_code as settle_code_second
,	inter.max_on_dt as on_date
from
	cte_union inter
left join
	dbo.tb_panel_interlock_process proc_first
	on	inter.group_key = proc_first.interlock_group_key
	and	proc_first.step = 1
left join
	dbo.tb_panel_interlock_process proc_second
	on	inter.group_key = proc_second.interlock_group_key
	and	proc_second.step = 2
left join
	dbo.erp_sdm_standard_operation sdm_oper
	on	inter.oper_code = sdm_oper.OPERATION_CODE
left join
	dbo.erp_sdm_item_revision model
	on	inter.model_code = model.BOM_ITEM_CODE
outer apply
(
	select top 1
		workorder_interlock_id
	,	interlock_code		as workorder_interlock_code
	,	on_remark			as workorder_on_remark
	,	on_update_user		as workorder_on_update_user
	,	[user_name]			as workorder_on_user_name
	,	on_dt				as workorder_on_dt
	from
		dbo.tb_workorder_interlock workorder
	left join
		dbo.tb_user on_user
		on	workorder.on_update_user = on_user.[user_id]
	where
		inter.workorder = workorder.workorder
	and	workorder.off_dt is null
	order by
		on_dt desc -- 현재 Batch 기준으로 인터락 걸린 건 중 최신 1건
) workorder_interlock
where 1=1)
union all
(select
	'5202'															as interlock_major_code
,	case
		when process.handle_dt is not null then 'O'
	end																as judge_code_first
,	case
		when process.settle_dt is not null then 'O'
	end 															as settle_code_first
,	NULL															as judge_code_second
,	NULL															as settle_code_second
,	fdc.create_dt													as on_date
from 
	dbo.tb_fdc_interlock fdc
join
	dbo.erp_wip_job_entities job
	on	fdc.workorder = job.JOB_NO
left join
	dbo.erp_sdm_standard_operation sdm_oper
	on	fdc.oper_code = sdm_oper.OPERATION_CODE
left join
	dbo.erp_sdm_standard_operation plus_sdm_oper
	on	fdc.plus_oper_code = plus_sdm_oper.OPERATION_CODE
left join
	dbo.erp_sdm_standard_operation to_sdm_oper
	on	fdc.to_oper_code = to_sdm_oper.OPERATION_CODE
cross apply
(
	select
		'[' + string_agg(formatmessage('{ "eqpCode": "%s", "eqpName": "%s"}', eqp_code, eqp.EQUIPMENT_DESCRIPTION), ',') + ']' as eqp_json
	,	max(start_dt)	as start_dt_4m
	,	max(end_dt)		as end_dt_4m
	,	max(model_code)	as model_code
	from
		dbo.tb_panel_4m panel_4m
	join
		dbo.erp_sdm_standard_equipment eqp
		on	panel_4m.eqp_code = eqp.EQUIPMENT_CODE
	where
		fdc.panel_group_key = panel_4m.group_key
	group by
		panel_4m.group_key
) [4m]
join
    dbo.erp_sdm_item_revision model 
    on	[4m].model_code = model.BOM_ITEM_CODE 
cross apply
(
	select
		count(*) as cnt
	from
		dbo.tb_panel_item item_inner
	where
		fdc.panel_group_key = item_inner.panel_group_key
) panel_item
left join
	dbo.tb_fdc_interlock_process process
	on	fdc.table_row_no = process.interlock_row_no
left join
	dbo.tb_user user_handle
	on	process.handle_user = user_handle.[user_id]
left join
	dbo.tb_user user_settle
	on	process.settle_user = user_settle.[user_id]
outer apply
(
	select top 1
		workorder_interlock_id
	,	interlock_code		as workorder_interlock_code
	,	on_remark			as workorder_on_remark
	,	on_update_user		as workorder_on_update_user
	,	[user_name]			as workorder_on_user_name
	,	on_dt				as workorder_on_dt
	from
		dbo.tb_workorder_interlock workorder
	left join
		dbo.tb_user on_user
		on	workorder.on_update_user = on_user.[user_id]
	where
		fdc.workorder = workorder.workorder
	and	workorder.off_dt is null
	order by
		on_dt desc -- 현재 Batch 기준으로 인터락 걸린 건 중 최신 1건
) workorder_interlock
where
	fdc.corp_id = @corp_id
and	fdc.fac_id = @fac_id
and fdc.judge = 'N' --  이상건만 조회 -> O는 중복데이터 계산 방지를 위해 내부적으로만 사용
and [4m].eqp_json is not null
and cast(fdc.create_dt as date) >= @from_date
))
select
	cte_last.*
,	case
		when interlock_major_code = '5202' then '4'
	else 
		code.sort
	end as sort
from
	cte_last
left join
	dbo.tb_code code
	on cte_last.interlock_major_code = code.code_id
	and code.codegroup_id = 'INTERLOCK_MAJOR'
where
	cte_last.interlock_major_code != '5007' -- 서정욱 프로 요청 Q Time 제외
and
	cte_last.interlock_major_code != '5556' -- TEST INTERLOCK 제외
order by sort, interlock_major_code
