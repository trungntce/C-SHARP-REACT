select
	[4m].workorder
,	[4m].oper_seq_no
,	[4m].oper_code
,	sdm_oper.OPERATION_DESCRIPTION as oper_description

,	[4m].eqp_code
,	[4m].start_dt
,	[4m].end_dt
,	datediff(ss, [4m].start_dt, [4m].end_dt) as diff

,	model.BOM_ITEM_CODE			as model_code
,	model.BOM_ITEM_DESCRIPTION	as model_description
from
	dbo.tb_panel_4m [4m]
join
	dbo.erp_wip_job_entities job
	on	[4m].workorder = job.JOB_NO
join
	dbo.erp_sdm_item_revision model
	on	job.BOM_ITEM_ID = model.BOM_ITEM_ID
join
	dbo.erp_wip_operations oper
	on	job.JOB_ID = oper.JOB_ID
	and [4m].oper_seq_no = oper.OPERATION_SEQ_NO
join
	dbo.erp_sdm_standard_operation sdm_oper
	on	oper.OPERATION_ID = sdm_oper.OPERATION_ID
where
	[4m].create_dt >= @from_dt and [4m].create_dt < @to_dt
and [4m].workorder = @workorder
and	[4m].eqp_code = @eqp_code
and	model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
order by
	case when @orderby = 'DIFF_ASC' then datediff(ss, [4m].start_dt, [4m].end_dt) else null end asc
,	case when @orderby = 'DIFF_DESC' then datediff(ss, [4m].start_dt, [4m].end_dt) else null end desc
,	case when @orderby = 'CREATE_ASC' then [4m].create_dt else null end asc
,	case when @orderby = 'CREATE_DESC' then [4m].create_dt else null end desc
;
