with cte as (
	select distinct
		workorder as workorder
	from 
		openjson(@workorder_list)
		with 
		(
			workorder varchar(50) '$.workorder'
		)
), cte_model as (
	select 
		workorder
	,	model.BOM_ITEM_CODE
	from 
		cte
	join 
		dbo.erp_wip_job_entities job
		on cte.workorder = job.JOB_NO
	join
		dbo.erp_sdm_item_revision model
		on job.BOM_ITEM_ID 	= model.BOM_ITEM_ID
	join
		dbo.tb_code code
		on code.code_id = model.BOM_ITEM_CODE
		and code.codegroup_id = 'LOADER_CONTROL_BY_MODEL'
		and use_yn = 'Y'
)select * from cte_model;