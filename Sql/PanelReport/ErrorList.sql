with cte as 
(
	select 
		a.device_id
	,	a.eqp_code
	,	'' as eqp_name
	,	a.img_path
	,	a.create_dt 
	,	(select top 1 workorder from tb_panel_4m where group_key = a.panel_group_key) as workorder
	from 
		tb_panel_error a
),
cte2 as 
(
	select
		job.JOB_NO 
	,   bom.BOM_ITEM_CODE as model_code
	,	bom.BOM_ITEM_DESCRIPTION as model_description
	from 
		dbo.erp_wip_job_entities job
	join    
		dbo.erp_sdm_item_revision bom
	on job.BOM_ITEM_ID = bom.BOM_ITEM_ID 
)
select 
	cte.*
,	cte2.*
from 
	cte
join 
	cte2 
on cte2.JOB_NO = cte.workorder
where 
	cte.create_dt >= @from_dt and cte.create_dt < @to_dt