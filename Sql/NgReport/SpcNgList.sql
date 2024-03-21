with cte as
(
    select distinct
        spc.panel_id
    ,   spc.ipqc_status
    ,   spc.check_type_id
    ,   spc.check_type_desc
    ,   spc.check_position_id
    ,   spc.check_position_desc
    ,   spc.check_number_id
    ,   spc.check_number_desc
    ,   spc.cs_status
    ,   spc.cust_min
    ,   spc.cust_max
    ,   spc.inner_min
    ,   spc.inner_max
    ,   spc.value_least
    ,   spc.value_greatest
    ,   CONVERT(VARCHAR(10),  spc.insp_dt, 11) + ' ' + CONVERT(VARCHAR(5),  spc.insp_dt, 108) as insp_dt
    ,   spc.insp_val

    ,   item.item_key
    ,   item.panel_group_key    as group_key

    ,   item.create_dt
    from
        dbo.tb_panel_spc spc
    join
        dbo.tb_panel_item item
        on	spc.item_key = item.item_key
    where
        item.create_dt >= @from_dt and item.create_dt < @to_dt
        and spc.cs_status = 'NG'
), cte_4m as
(
    select
        row_number() over (partition by group_key order by row_key) as row_num -- group_key 로 첫번째
    ,   *
    from
        dbo.tb_panel_4m
    where
        group_key in (select group_key from cte)
)
select
    case when ctq.eqp_code is not null then 'Y' else null end as ctq_flag
,   cte.*

,   cte_4m.eqp_code
,   sdm_eqp.EQUIPMENT_DESCRIPTION as eqp_name
,   cte_4m.workorder
,   cte_4m.oper_code
,   cte_4m.oper_seq_no              as oper_seq_no
,   sdm_oper.OPERATION_DESCRIPTION	as oper_description
,   cte_4m.create_dt                as create_dt_4m

,   model.BOM_ITEM_CODE             as model_code
,   model.BOM_ITEM_DESCRIPTION		as model_description
from
    cte
join
    cte_4m
    on      cte.group_key = cte_4m.group_key
    and cte_4m.row_num = 1
join
    dbo.erp_wip_job_entities job
    on      cte_4m.workorder = job.JOB_NO
join
    dbo.erp_sdm_item_revision model
    on      job.BOM_ITEM_ID = model.BOM_ITEM_ID
join
    dbo.erp_sdm_standard_operation sdm_oper
    on      cte_4m.oper_code = sdm_oper.OPERATION_CODE
join
    dbo.erp_sdm_standard_equipment sdm_eqp
    on cte_4m.eqp_code = sdm_eqp.EQUIPMENT_CODE
left join 
		dbo.tb_ctq ctq
		on ctq.eqp_code 	= cte_4m.eqp_code 
where 1=1
and	cte_4m.workorder = @workorder
and	cte_4m.eqp_code = @eqp_code
and	model.BOM_ITEM_CODE = @model_code
and model.BOM_ITEM_DESCRIPTION like '%' + @model_name + '%'
order by
    cte.create_dt desc
;