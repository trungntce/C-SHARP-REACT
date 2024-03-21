with cte_vrs as
(
 select
                max(a.workorder) as workorder,
                (
                    select
                        item.scan_dt as scan_dt
                    from
                            dbo.tb_panel_item item
                    where
                            item.panel_group_key in (
                        select top 1 p4.group_key
                        from tb_panel_aoi_mapping p4
                    where p4.job_no = @workorder
                    and p4.operation_code = @oper_code
                    )
                    and item.panel_id = @pnl_id
                ) as scan_dt,
                max(a.roll_id) as roll_id,
                max(a.defect_cnt) as ng_cnt,
                sum(a.defect_cnt) 	as total_cnt,
                max(a.eqp_name) as eqp_name,
                max(a.panel_id) as pnl_id,
                b.code_name as ng_name
        from
                --v_aoi a
                dbo.fn_aoi_data(@from_dt, @to_dt) a
        --outer apply (
        --    select
        --        max(p4m.scan_dt) as scan_dt
        --    from dbo.tb_panel_item pi
        --    join dbo.tb_panel_4m p4m
        --    on p4m.group_key = pi.panel_group_key
        --                where  pi.panel_id = a.panel_id
        --                and p4m.workorder = a.workorder
        --    group by pi.panel_id
        --    ) tbl_4m
        left join
                tb_code b
                on b.codegroup_id = 'VRS_NG_CODE'
                and b.code_id           = a.ngcode
        --left join
        --        erp_sdm_standard_equipment SSE
        --        on SSE.EQUIPMENT_CODE = a.eqp_code
    where
        a.panel_id = @pnl_id
    --and a.workorder like '%' + @workorder + '%'
    and a.workorder = @workorder
    --and a.mesdate between @from_mes and @to_mes
    --and a.create_dt >= @from_dt and a.create_dt < @to_dt
    and a.eqp_code = @eqp_code
    and a.eqp_name = @eqp_name
    and a.model_code = @model_code
    and a.oper_code = @oper_code
        group by a.workorder
        ,       a.oper_seq_no
        ,       b.code_name
)
select
    ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS row_id,
    cte_vrs.*,
    (
    select sum(cte_vrs.total_cnt) as toltal_ng from cte_vrs
    ) as total_ng
from
        cte_vrs
;