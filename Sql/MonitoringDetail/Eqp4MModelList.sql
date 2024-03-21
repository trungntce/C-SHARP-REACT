with cte as
(
	select
		workorder
	,	oper_seq_no
	,	oper_code
	,	eqp_code
	from
		dbo.tb_panel_4m
	where
		 end_dt is null
	and eqp_code = @eqp_code
)
select
	cte.*
,	model.BOM_ITEM_CODE		as model_code
,	BOM_ITEM_DESCRIPTION	as model_name
,	oper.OPERATION_DESCRIPTION 
from
	cte
join
	dbo.erp_wip_job_entities job
	on	cte.workorder =job.JOB_NO
join
	dbo.erp_sdm_item_revision model
	on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
join
	dbo.erp_sdm_standard_operation oper
	on cte.oper_code = oper.OPERATION_CODE 
option(force order)
;