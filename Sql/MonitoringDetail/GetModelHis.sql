declare @to_dt datetime = getdate();	

declare @am8 datetime;
select @am8 = dateadd(hour, 8, cast(cast(@to_dt as date) as datetime));

if datepart(hour, @to_dt) < 8
	select @am8 = dateadd(dd, -1, @am8);	


with cte_start_over as 
(
	select
		*
	from
		tb_panel_4m tpm 
	where
		eqp_code = @eqp_code
		and start_dt >= @am8	
),cte_end_over as 
(
	select
		*
	from
		tb_panel_4m tpm2 
	where
		eqp_code = @eqp_code
		and start_dt <= @am8 and (end_dt >= @am8 or end_dt is null)
),cte_all as 
(
	select
		*
	from
		cte_start_over
	union all
	select
		*
	from
		cte_end_over
),cte_list as 
(
	select
		string_agg(workorder,',') as workorders
	,	max(workorder) as workorder
	,	max(eqp_code) 	as eqp_code
	,	group_key 		as group_key
	,	case when max(start_dt) < @am8 then  @am8 else max(start_dt) end as start_dt
	,	case when max(end_dt) is null then @to_dt else max(end_dt) end as end_dt
	,	max(model_code)	as model_code
	from 
		cte_all
	group by group_key
)
select 
	[4m].*
,	model.BOM_ITEM_DESCRIPTION
,	@am8	as today
from 
	cte_list [4m]
join
	dbo.erp_wip_job_entities job
	on	[4m].workorder = job.JOB_NO
join
	dbo.erp_sdm_item_revision model
	on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
order by start_dt
