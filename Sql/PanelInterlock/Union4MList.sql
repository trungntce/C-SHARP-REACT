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
join
	dbo.tb_code code
	on	inter.interlock_code = code.code_id
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
and	code.codegroup_id = 'HOLDINGREASON'
and	code.rule_val != 'GROUP'
and	
(
	(@from_to_dt_type = 'I' and inter.on_dt >= @from_dt and inter.on_dt < @to_dt)
	or
	(@from_to_dt_type = 'P' and item.create_dt >= @from_dt and item.create_dt < @to_dt)
)
and	(inter.interlock_code like @interlock_code_major + '%' or inter.interlock_code like case when @interlock_code_major = '5003' then '5103' end + '%')
and	inter.interlock_code = @interlock_code	
and	[4m].workorder = @workorder
and	[4m].oper_code = @oper_code
and	[4m].model_code = @model_code
and	item.eqp_code = @eqp_code
;

declare @tbl_union_ignore_param table
(
	header_group_key	varchar(32)
,	group_key			varchar(32)
,	panel_group_key		varchar(30)
,	panel_row_key		varchar(30)
,	workorder			varchar(50)
,	oper_seq_no			int
,	oper_code			varchar(30)
,	model_code			varchar(50)
,	eqp_code			varchar(30)
,	start_dt_4m			datetime
,	end_dt_4m			datetime
,	interlock_code		varchar(40)
,	max_on_dt			datetime
,	on_remark			nvarchar(1024)
,	panel_cnt			int	
);

with cte_union as
(
	select
		inter.header_group_key
	,	inter.group_key

	,	inter.panel_group_key
	,	inter.panel_row_key
	,	inter.workorder
	,	[4m].oper_seq_no
	,	[4m].oper_code
	,	[4m].model_code
	,	[4m].eqp_code
	,	[4m].start_dt as start_dt_4m
	,	[4m].end_dt as end_dt_4m
	,	inter.interlock_code
	,	inter.on_dt as max_on_dt
	,	inter.on_remark
	,	
	(
		select
			count(*) as panel_cnt
		from
			dbo.tb_panel_interlock agg
		join
			dbo.tb_panel_item item
			on	agg.item_key = item.item_key
		join
			dbo.tb_panel_realtime [real]
			on item.panel_id = [real].panel_id
		where
			inter.header_group_key = agg.header_group_key
	) as panel_cnt
	from
		dbo.tb_panel_4m_interlock inter
	join
		dbo.tb_panel_4m [4m]
		on	inter.panel_row_key = [4m].row_key
	where
		inter.corp_id = @corp_id
	and	inter.fac_id = @fac_id
	and	
	(
		(@from_to_dt_type = 'I' and inter.on_dt >= @from_dt and inter.on_dt < @to_dt)
		or
		(@from_to_dt_type = 'P' and [4m].create_dt >= @from_dt and [4m].create_dt < @to_dt)
	)
	and	(inter.interlock_code like @interlock_code_major + '%' or inter.interlock_code like case when @interlock_code_major = '5003' then '5103' end + '%')
	and	inter.interlock_code = @interlock_code	
	and	[4m].workorder = @workorder
	and	[4m].oper_code = @oper_code
	and	[4m].model_code = @model_code
	and	item.eqp_code = @eqp_code	
	union	all
	select -- 그룹키로 안묶인 항목
		null as header_group_key
	,	null as group_key

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
	,	max(on_dt) as max_on_dt
	,	max(on_remark) as on_remark
	,	count(*) as panel_cnt
	from
		@tbl_ignore_param cte
	where
		group_key is null
	group by
		panel_group_key, row_key, workorder, oper_seq_no, oper_code, model_code, eqp_code, interlock_code
	union all
	select -- 그룹키로 묶인 항목(판정이나 합의가 진행된 항목)
		null as header_group_key
	,	group_key

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
	,	max(on_dt) as max_on_dt
	,	max(on_remark) as on_remark
	,	count(*) as panel_cnt
	from
		@tbl_ignore_param cte
	where
		group_key is not null
	group by
		panel_group_key, row_key, group_key, workorder, oper_seq_no, oper_code, model_code, eqp_code, interlock_code
)
insert into
	@tbl_union_ignore_param
select
	*
from
	cte_union
;

select
	row_number() over (order by inter.max_on_dt desc) as row_no
,	inter.*
,	case 
		--when inter.header_group_key is not null then
		--(
		--	select
		--		agg.panel_interlock_id as id
		--	,	item.panel_id
		--	,	item.item_key
		--	,	item.create_dt

		--	,	item.recipe_judge
		--	,	item.param_judge
		--	,	item.spc_judge
		--	,	item.qtime_lock
		--	,	item.chem_judge

		--	,	[real].workorder as workorder_real
		--	,	[real].interlock_yn
		--	from
		--		dbo.tb_panel_interlock agg
		--	join
		--		dbo.tb_panel_item item
		--		on	agg.item_key = item.item_key
		--	join
		--		dbo.tb_panel_realtime [real]
		--		on item.panel_id = [real].panel_id
		--	where
		--		inter.header_group_key = agg.header_group_key
		--	order by
		--		panel_id
		--	for json path
		--) 
		when inter.header_group_key is null and inter.group_key is null then
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
				@tbl_ignore_param agg
			where
				agg.group_key is null
			and	agg.workorder = inter.workorder
			and	agg.oper_seq_no = inter.oper_seq_no
			and	agg.model_code = inter.model_code
			and	agg.eqp_code = inter.eqp_code
			and	agg.interlock_code = inter.interlock_code
			order by
				panel_id
			for json path
		) 
		when inter.header_group_key is null and inter.group_key is not null then
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
				@tbl_ignore_param agg
			where
				agg.group_key is not null
			and	agg.workorder = inter.workorder
			and	agg.oper_seq_no = inter.oper_seq_no
			and	agg.model_code = inter.model_code
			and	agg.eqp_code = inter.eqp_code
			and	agg.interlock_code = inter.interlock_code
			order by
				panel_id
			for json path
		) 
	end as panel_json

,	left(interlock_code, 4) as interlock_code_major
,	case 
		when interlock_code like '%_C' then 'C-NG'
		when interlock_code like '%_S' then 'S-NG'
		else 'S-NG'
	end as gubun
,	code.start_val as interlock_class

,	sdm_oper.OPERATION_DESCRIPTION as oper_name
,	concat_ws('::', sdm_oper.OPERATION_DESCRIPTION, sdm_oper_tl.OPERATION_DESCRIPTION, '') as tran_oper_name
,	model.BOM_ITEM_DESCRIPTION	as model_name

,	proc_first.judge_code as judge_code_first
,	proc_first.judge_method as judge_method_first
,	proc_first.judge_remark as judge_remark_first
,	proc_first.judge_attach as judge_attach_first
,	proc_first.judge_dt as judge_dt_first

,	proc_first.settle_code as settle_code_first
,	proc_first.settle_remark as settle_remark_first
,	proc_first.settle_attach as settle_attach_first
,	proc_first.settle_dt as settle_dt_first

,	case when proc_first.judge_code = 'R' then proc_first.reference_code end as rework_code_first
,	case when proc_first.judge_code = 'D' then proc_first.reference_code end as defect_code_first

--,	rework_first.rework_code as rework_code_first
--,	rework_first.refuse_dt as rework_refust_dt_first
--,	rework_first.approve_dt as rework_approve_dt_first

--,	defect_first.defect_code as defect_code_first
--,	defect_first.off_dt as defect_off_dt_first

,	proc_first.reference_code as reference_code_first
--,	proc_first.reference_id as reference_id_first

,	proc_second.judge_code as judge_code_second
,	proc_second.judge_method as judge_method_second
,	proc_second.judge_remark as judge_remark_second
,	proc_second.judge_attach as judge_attach_second
,	proc_second.judge_dt as judge_dt_second

,	proc_second.settle_code as settle_code_second
,	proc_second.settle_remark as settle_remark_second
,	proc_second.settle_attach as settle_attach_second
,	proc_second.settle_dt as settle_dt_second

,	case when proc_second.judge_code = 'R' then proc_second.reference_code end as rework_code_second
,	case when proc_second.judge_code = 'D' then proc_second.reference_code end as defect_code_second

,	case 
		when proc_first.judge_code = proc_first.settle_code then 'Y'
		when proc_second.judge_code = proc_second.settle_code then 'Y'
		else 'N'
	end as complete_yn

,	issue.issue_remark
,	issue.issue_attach
,	issue.issue_user
,	issue.issue_dt

--,	rework_second.rework_code as rework_code_second
--,	rework_second.refuse_dt as rework_refust_dt_second
--,	rework_second.approve_dt as rework_approve_dt_second

--,	defect_second.defect_code as defect_code_second
--,	defect_second.off_dt as defect_off_dt_second

,	proc_second.reference_code as reference_code_second
--,	proc_second.reference_id as reference_id_second

,	workorder_interlock.workorder_interlock_id
,	workorder_interlock.workorder_interlock_code
,	workorder_interlock.workorder_on_remark
,	workorder_interlock.workorder_on_update_user
,	workorder_interlock.workorder_on_user_name
,	workorder_interlock.workorder_on_dt
from
	@tbl_union_ignore_param inter
join
	dbo.tb_code code
	on	inter.interlock_code = code.code_id
left join
	dbo.tb_panel_interlock_process proc_first
	on	inter.group_key = proc_first.interlock_group_key
	and	proc_first.step = 1
--left join
--	dbo.tb_panel_rework rework_first
--	on	proc_first.judge_code = 'R'
--	and	inter.panel_interlock_id = rework_first.panel_interlock_id
--left join
--	dbo.tb_panel_defect defect_first
--	on	proc_first.judge_code = 'D'
--	and	inter.panel_interlock_id = defect_first.panel_interlock_id
left join
	dbo.tb_panel_interlock_process proc_second
	on	inter.group_key = proc_second.interlock_group_key
	and	proc_second.step = 2
--left join
--	dbo.tb_panel_rework rework_second
--	on	proc_second.judge_code = 'R'
--	and	inter.panel_interlock_id = rework_second.panel_interlock_id
--left join
--	dbo.tb_panel_defect defect_second
--	on	proc_second.judge_code = 'D'
--	and	inter.panel_interlock_id = defect_second.panel_interlock_id
left join
	dbo.tb_panel_interlock_issue issue
	on	inter.group_key = issue.interlock_group_key
left join
	dbo.erp_sdm_standard_operation sdm_oper
	on	inter.oper_code = sdm_oper.OPERATION_CODE
join
	dbo.erp_sdm_standard_operation_tl sdm_oper_tl
	on sdm_oper.OPERATION_ID = sdm_oper_tl.OPERATION_ID
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
where
	code.codegroup_id = 'HOLDINGREASON'
and	proc_first.judge_code = @judge_code_first
and	proc_second.judge_code = @judge_code_second
and @process_status = case when (proc_first.judge_code = proc_first.settle_code or proc_second.judge_code = proc_second.settle_code) then 'C' else 'P' end
order by
	inter.max_on_dt desc
;