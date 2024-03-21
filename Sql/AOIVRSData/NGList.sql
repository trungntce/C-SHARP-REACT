with cte_pnl as
(
        select
                item.panel_id as pnl_id,
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
), cte as
(
 select
                a.workorder as workorder,
                --a.roll_id as roll_id,
                a.pcs_total as pcs_total,
                a.panel_qty as panel_cnt,
                a.defect_cnt       as ng_cnt,
                a.oper_code   as oper_code,
                a.eqp_code    as eqp_code,
                a.eqp_name    as eqp_name,
                a.model_code    as model_code,
                a.panel_id as pnl_id,
                b.code_name as ng_name
        from
                --v_aoi a
                dbo.fn_aoi_data(@from_dt, @to_dt) a
        left join
                tb_code b
                on b.codegroup_id = 'VRS_NG_CODE'
                and b.code_id           = a.ngcode
        where
            --a.workorder like '%' + @workorder + '%'
            a.workorder = @workorder
        --and a.mesdate between @from_mes and @to_mes
        --and a.create_dt >= @from_dt and a.create_dt < @to_dt
        and a.eqp_code = @eqp_code
        and a.eqp_name = @eqp_name
        and a.model_code = @model_code
        and a.oper_code = @oper_code
), cte_ng as
(
    select
        cte.pnl_id as pnl_id,
        max(cte.ng_cnt) as max_cnt,
        sum(cte.ng_cnt) as total_ng
    from cte
    group by cte.pnl_id
), cte_list as
(
select
    max(cte.workorder) as workorder,
    --max(cte.roll_id) as roll_id,
    cte.pnl_id as pnl_id,
    null as scan_dt,
    max(cte.ng_name) as worst_name,
    isnull(max(cte_ng.max_cnt), 0) as worst_cnt,
    isnull(max(cte_ng.total_ng), 0) as total_ng,
    isnull((max(cte.pcs_total)/ max(cte.panel_cnt)), 0) as pcs_total,
    max(cte.oper_code) as oper_code,
    max(cte.eqp_code)    as eqp_code,
    max(cte.eqp_name)    as eqp_name,
    max(cte.model_code)    as model_code
from cte
join cte_ng
    on cte_ng.pnl_id = cte.pnl_id
where cte_ng.max_cnt = cte.ng_cnt and cte_ng.pnl_id = cte.pnl_id
group by cte.pnl_id
), cte_union as
(
select
    ls.workorder as workorder,
    --ls.roll_id as roll_id,
    pnl.pnl_id as pnl_id,
    pnl.scan_dt as scan_dt,
    ls.worst_name as worst_name,
    ls.worst_cnt as worst_cnt,
    ls.total_ng as total_ng,
    ls.pcs_total as pcs_total,
    ls.oper_code as oper_code,
    ls.eqp_code   as eqp_code,
    ls.eqp_name    as eqp_name,
    ls.model_code    as model_code
from cte_list ls
right join cte_pnl pnl
on ls.pnl_id = pnl.pnl_id
union
select cte_list. *
from cte_list
where cte_list.pnl_id not in (select pnl_id from cte_pnl)
)
select 
    ROW_NUMBER() OVER(ORDER BY (SELECT 1)) AS row_id,
	cte_union.*
from cte_union