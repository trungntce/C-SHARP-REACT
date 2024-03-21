select
    '5202' as interlock_major_code
	, case when process.handle_dt is not null and process.settle_dt is not null then 1
			else 0 end as judge
	, fdc.create_dt as on_date
from dbo.tb_fdc_interlock fdc
join dbo.erp_wip_job_entities job
	on  fdc.workorder = job.JOB_NO
cross apply
(
        select 
			'[' + string_agg(formatmessage('{ "eqpCode": "%s", "eqpName": "%s"}', eqp_code, eqp.EQUIPMENT_DESCRIPTION), ',') + ']' as eqp_json
			, max(model_code) as model_code
        from dbo.tb_panel_4m panel_4m
        join dbo.erp_sdm_standard_equipment eqp
			on panel_4m.eqp_code = eqp.EQUIPMENT_CODE
        where fdc.panel_group_key = panel_4m.group_key
        group by panel_4m.group_key
) [4m]
join
    dbo.erp_sdm_item_revision model
    on  [4m].model_code = model.BOM_ITEM_CODE
cross apply
(
        select count(*) as cnt
        from dbo.tb_panel_item item_inner
        where fdc.panel_group_key = item_inner.panel_group_key
) panel_item
left join dbo.tb_fdc_interlock_process process
	on fdc.table_row_no = process.interlock_row_no
where
        fdc.corp_id = @corp_id
and     fdc.fac_id = @fac_id
and fdc.judge = 'N'
and [4m].eqp_json is not null
and fdc.create_dt >= @from_date