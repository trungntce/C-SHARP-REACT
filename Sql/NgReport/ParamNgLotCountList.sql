
with cte as
	(
		select 
			param_row.*
		from
			dbo.tb_panel_4m_param_row param_row
		join
			dbo.tb_panel_4m [4m]
			on	param_row.row_key = [4m].row_key
		join
			dbo.erp_wip_job_entities job
			on	[4m].workorder = job.JOB_NO
		join
			dbo.erp_sdm_item_revision model
			on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
		where
			param_row.judge = 'N'
		and [4m].create_dt >= DATEADD(MONTH, -1, GETDATE()) and [4m].create_dt < GETDATE()		
		and	(@workorder is null or param_row.workorder = @workorder)
		and (@eqp_code is null or param_row.eqp_code = @eqp_code)
		and	(@model_code is null or model.BOM_ITEM_CODE = @model_code)
		and	(@model_name is null or model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%')
	), cte2 as
	(
		select
			group_key
		,	max(workorder)			as workorder
		,	string_agg(cast(workorder as nvarchar(max)), ',') as workorder_list
		,	eqp_code
		,	max(cte.oper_seq_no)	as oper_seq_no
		,	param_id
		,	max(param_name)			as param_name
		,	min(lcl)				as lcl
		,	max(ucl)				as ucl
		,	min(create_dt)			as eqp_min_dt
		,	max(create_dt)			as eqp_max_dt
		,	min(eqp_min_val)		as eqp_min_val
		,	max(eqp_max_val)		as eqp_max_val
		,	avg(eqp_avg_val)		as eqp_avg_val
		,	max(table_name)			as table_name
		,	max(column_name)		as column_name
		from
			cte
		group by 
			group_key, eqp_code, param_id
	), cte3 as
	(
		select
			workorder
		,
		(
			select 
				string_agg([value], ',') 
			from 
			(
				select distinct [value] from string_split(workorder_list, ',')
			) a
		) as workorder_list
		,	eqp_code
		,	oper_seq_no
		,	group_key
		,	param_id
		,	param_name
		,	lcl
		,	ucl
		,	eqp_min_dt
		,	eqp_max_dt
		,	eqp_min_val
		,	eqp_max_val
		,	eqp_avg_val
		,	table_name
		,	column_name
		from
			cte2
	)
	select
		'Parameter' as type_name
	,	sum(case when cte.eqp_max_dt between DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) and getDate() then 1 else 0 end) as mon_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -6, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -5, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day7_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -5, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day6_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day5_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day4_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day3_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(GETDATE() AS DATE) then 1 else 0 end) as day2_val
	,	sum(case when cte.eqp_max_dt between CAST(GETDATE() AS DATE)  and getDate()  then 1 else 0 end) as day1_val

	,	sum(case when cte.eqp_max_dt between DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) and getDate() and ctq.eqp_code is not null then 1 else 0 end) as mon_ctq_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -6, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -5, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day7_ctq_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -5, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day6_ctq_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day5_ctq_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day4_ctq_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day3_ctq_val
	,	sum(case when cte.eqp_max_dt between CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(GETDATE() AS DATE) and ctq.eqp_code is not null then 1 else 0 end) as day2_ctq_val
	,	sum(case when cte.eqp_max_dt between CAST(GETDATE() AS DATE)  and getDate() and ctq.eqp_code is not null then 1 else 0 end) as day1_ctq_val

	from
		cte3 cte
	join
		dbo.erp_wip_job_entities job
		on	cte.workorder = job.JOB_NO
	join
		dbo.erp_wip_operations oper
		on	job.JOB_ID = oper.JOB_ID
		and	cte.oper_seq_no = oper.OPERATION_SEQ_NO
	join
		dbo.erp_sdm_standard_operation sdm_oper
		on oper.OPERATION_ID = sdm_oper.OPERATION_ID
	join
		dbo.erp_sdm_item_revision model
		on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
	join 
		dbo.erp_sdm_standard_equipment eqp
		on cte.eqp_code = eqp.EQUIPMENT_CODE
	left join
		dbo.tb_ctq ctq
		on	cte.table_name = ctq.table_name
		and	cte.column_name = ctq.column_name
	;