with cte as
(
	select distinct
		[param].param_id
	,	[param].panel_id
	,	[param].std
	,	[param].lcl
	,	[param].ucl
	,	[param].lsl
	,	[param].usl
	,	[param].eqp_min_val
	,	[param].eqp_max_val
	,	[param].eqp_avg_val
	,	[param].eqp_start_dt
	,	[param].eqp_end_dt
	,	[param].judge
	,	[param].raw_type
	,	[param].table_name
	,	[param].column_name
	,	item.item_key
	,	item.panel_group_key as group_key
	,	item.create_dt
	from
		dbo.tb_panel_param [param]
	join
		dbo.tb_panel_item item
		on	[param].item_key = item.item_key
	where
		item.create_dt >= DATEADD(MONTH, -1, GETDATE()) and item.create_dt < GETDATE()
	and [param].judge = 'N'
), cte_4m as
(
	select
		row_number() over (partition by group_key order by row_key) as row_num -- group_key 로 첫번째
	,	*
	from
		dbo.tb_panel_4m
	where
		group_key in (select group_key from cte)
)
select
	'Parameter' as type_name
,	sum(case when cte.create_dt between DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) and getDate() then 1 else 0 end) as mon_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -6, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -5, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day7_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -5, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day6_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day5_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day4_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME) then 1 else 0 end) as day3_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(GETDATE() AS DATE) then 1 else 0 end) as day2_val
,	sum(case when cte.create_dt between CAST(GETDATE() AS DATE)  and getDate()  then 1 else 0 end) as day1_val

,	sum(case when cte.create_dt between DATEFROMPARTS(YEAR(GETDATE()), MONTH(GETDATE()), 1) and getDate() and ctq.eqp_code is not null then 1 else 0 end) as mon_ctq_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -6, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -5, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day7_ctq_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -5, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day6_ctq_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -4, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day5_ctq_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -3, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day4_ctq_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -2, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME) and ctq.eqp_code is not null then 1 else 0 end) as day3_ctq_val
,	sum(case when cte.create_dt between CAST(DATEADD(DAY, -1, CAST(GETDATE() AS DATE)) AS DATETIME)  and CAST(GETDATE() AS DATE) and ctq.eqp_code is not null then 1 else 0 end) as day2_ctq_val
,	sum(case when cte.create_dt between CAST(GETDATE() AS DATE)  and getDate() and ctq.eqp_code is not null then 1 else 0 end) as day1_ctq_val
from
	cte
join
	cte_4m
	on	cte.group_key = cte_4m.group_key
	and cte_4m.row_num = 1
join
	dbo.erp_wip_job_entities job
	on	cte_4m.workorder = job.JOB_NO
join
	dbo.erp_sdm_item_revision model
	on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
join
	dbo.erp_sdm_standard_operation sdm_oper
	on	cte_4m.oper_code = sdm_oper.OPERATION_CODE
join
	dbo.tb_param [param]
	on	cte.param_id = [param].param_id
left join 
		dbo.tb_ctq ctq
		on ctq.eqp_code 	= cte_4m.eqp_code 
where 1=1
and	cte_4m.workorder = @workorder
and	cte_4m.eqp_code = @eqp_code
and	model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
;