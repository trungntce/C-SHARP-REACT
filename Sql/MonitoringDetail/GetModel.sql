declare @to_dt   datetime = getdate()
declare @am8 datetime
-- 8시 기준(8시 이후인 경우 오늘 오전8시, 8시 이전인 경우 어제 오전8시
select @am8 = dateadd(hour, 8, cast(cast(@to_dt as date) as datetime));

if datepart(hour, @to_dt) < 8
	select @am8 = dateadd(dd, -1, @am8);

with cte as 
(
	select
		*
	,	ROW_NUMBER () over (partition by eqp_code order by start_dt desc) as recent_no
	from
		tb_panel_4m tpm 
	where
		start_dt > @am8
		and eqp_code is not null
		and end_dt is null
)
select 
	[4m].workorder
,	[4m].eqp_code	
,	[4m].start_dt
,	model.BOM_ITEM_DESCRIPTION
,	[real].fac_no 
,	[real].room_name 
,	[real].eqp_type 
from 
	cte [4m]
join
	dbo.erp_wip_job_entities job
	on [4m].workorder = job.JOB_NO 
join
	dbo.erp_sdm_item_revision model
	on job.BOM_ITEM_ID = model.BOM_ITEM_ID
join
	dbo.tb_eqp_real [real]
	on [4m].eqp_code = [real].eqp_code 
	
where recent_no = '1'
	and fac_no = @fac_no
	and room_name = @room_name
	and eqp_type = @eqp_type
