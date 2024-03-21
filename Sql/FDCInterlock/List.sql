select
	fdc.*
,	[4m].*
,	substring([4m].model_code, charindex('-', [4m].model_code) + 1, 1) as prod_type
,	panel_item.cnt						as panel_cnt

,   model.BOM_ITEM_CODE					as model_code
,   model.BOM_ITEM_DESCRIPTION			as model_name

,	sdm_oper.OPERATION_DESCRIPTION		as oper_name
,	plus_sdm_oper.OPERATION_DESCRIPTION	as plus_oper_name
,	to_sdm_oper.OPERATION_DESCRIPTION	as to_oper_name

,	process.handle_code
,	process.handle_remark
,	process.handle_attach
,	process.handle_user
,	user_handle.[user_name]				as handle_user_name
,	process.handle_dt

,	process.settle_remark
,	process.settle_attach
,	process.settle_user
,	user_settle.[user_name]				as settle_user_name
,	process.settle_dt

,	process.reference_id
,	process.reference_code

,	workorder_interlock.workorder_interlock_id
,	workorder_interlock.workorder_interlock_code
,	workorder_interlock.workorder_on_remark
,	workorder_interlock.workorder_on_update_user
,	workorder_interlock.workorder_on_user_name
,	workorder_interlock.workorder_on_dt
from 
	dbo.tb_fdc_interlock fdc
left join
	dbo.erp_sdm_standard_operation sdm_oper
	on	fdc.oper_code = sdm_oper.OPERATION_CODE
	and	sdm_oper.SOB_ID = 90
	and	sdm_oper.ORG_ID = 901
left join
	dbo.erp_sdm_standard_operation plus_sdm_oper
	on	fdc.plus_oper_code = plus_sdm_oper.OPERATION_CODE
	and	plus_sdm_oper.SOB_ID = 90
	and	plus_sdm_oper.ORG_ID = 901
left join
	dbo.erp_sdm_standard_operation to_sdm_oper
	on	fdc.to_oper_code = to_sdm_oper.OPERATION_CODE
	and	to_sdm_oper.SOB_ID = 90
	and	to_sdm_oper.ORG_ID = 901
cross apply
(
	select
		'[' + string_agg(formatmessage('{ "eqpCode": "%s", "eqpName": "%s"}', eqp_code, eqp.EQUIPMENT_DESCRIPTION), ',') + ']' as eqp_json
	,	max(start_dt)	as start_dt_4m
	,	max(end_dt)		as end_dt_4m
	,	max(model_code)	as model_code
	from
		dbo.tb_panel_4m panel_4m
	join
		dbo.erp_sdm_standard_equipment eqp
		on	panel_4m.eqp_code = eqp.EQUIPMENT_CODE
		and	eqp.SOB_ID = 90
		and	eqp.ORG_ID = 901

	where
		fdc.panel_group_key = panel_4m.group_key
	and	eqp_code = @eqp_code
	group by
		panel_4m.group_key
) [4m]
join
    dbo.erp_sdm_item_revision model 
    on	[4m].model_code = model.BOM_ITEM_CODE 
	and	model.SOB_ID = 90
	and	model.ORG_ID = 901
cross apply
(
	select
		count(*) as cnt
	from
		dbo.tb_panel_item item_inner
	where
		fdc.panel_group_key = item_inner.panel_group_key
) panel_item
left join
	dbo.tb_fdc_interlock_process process
	on	fdc.table_row_no = process.interlock_row_no
left join
	dbo.tb_user user_handle
	on	process.handle_user = user_handle.[user_id]
left join
	dbo.tb_user user_settle
	on	process.settle_user = user_settle.[user_id]
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
		fdc.workorder = workorder.workorder
	and	workorder.off_dt is null
	order by
		on_dt desc -- 현재 Batch 기준으로 인터락 걸린 건 중 최신 1건
) workorder_interlock
where
	fdc.corp_id = @corp_id
and	fdc.fac_id = @fac_id
and fdc.judge = 'N' --  이상건만 조회 -> O는 중복데이터 계산 방지를 위해 내부적으로만 사용
and [4m].eqp_json is not null
and	
(
	(@from_to_dt_type = 'I' and fdc.create_dt >= @from_dt and fdc.create_dt < @to_dt)
	or
	(@from_to_dt_type = '4' and [4m].start_dt_4m >= @from_dt and [4m].start_dt_4m < @to_dt)
)
and model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
and	fdc.fdc_type = @fdc_type
and	workorder = @workorder
and	oper_type = @oper_type
and	oper_code = @oper_code
and (@process_step != 'H' or (process.handle_dt is not null and process.settle_dt is null))
and (@process_step != 'S' or (process.handle_dt is not null and process.settle_dt is not null))
order by
	fdc.table_row_no desc
;