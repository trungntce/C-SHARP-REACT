with cte_list as
(
    select
        [4m].oper_seq_no as oper_seq_no
    ,	max(sse.EQUIPMENT_DESCRIPTION) as eqp_description
    ,   max(sso.OPERATION_DESCRIPTION) as oper_description
    ,   (
        select
            max([4m].oper_seq_no) as oper_seq_no
        from
            dbo.tb_panel_4m [4m]
        where group_key in (
                select a.panel_group_key 
                from dbo.tb_panel_item a 
                where    a.panel_id = @pnl_id
                )
            and [4m].oper_code = @oper_code
            and [4m].oper_code in ('E05010','E05020','E05030','E05040')
        ) as oper_seq_num
     ,   (
            select
                min([4m].oper_seq_no) as oper_seq_no
            from
                dbo.tb_panel_4m [4m]
            where group_key in (
                    select a.panel_group_key 
                    from dbo.tb_panel_item a 
                    where    a.panel_id = @pnl_id
                    )
                and [4m].oper_code in ('E05010','E05020','E05030','E05040')
                and [4m].oper_code != @oper_code
        ) as oper_seq_prev
    from
        dbo.tb_panel_4m [4m]
    left join
    	dbo.erp_sdm_standard_equipment sse
    	on	[4m].eqp_code = sse.EQUIPMENT_CODE
    left join
        dbo.erp_sdm_standard_operation sso
        on	[4m].oper_code = sso.OPERATION_CODE
    where group_key in (
            select a.panel_group_key 
            from dbo.tb_panel_item a 
            where    a.panel_id = @pnl_id
            )
    group by [4m].oper_seq_no
)
select 
        list.*
from cte_list list
where
    (list.oper_seq_num <= 1600 and oper_seq_no < oper_seq_num)
    or (list.oper_seq_num > 1600 and (oper_seq_no > oper_seq_prev and oper_seq_no < oper_seq_num))
    or (oper_seq_prev is null and oper_seq_no < oper_seq_num)

--select
--	oper.OPERATION_SEQ_NO				as oper_seq_no
--	, sdm_oper.OPERATION_DESCRIPTION	as oper_description
--	, eqp.EQUIPMENT_DESCRIPTION			as eqp_description
--from
--	dbo.erp_wip_job_entities job
--left join
--	dbo.erp_wip_operations oper
--	on	job.JOB_ID = oper.JOB_ID
--left join
--	dbo.erp_sdm_standard_operation sdm_oper
--	on oper.OPERATION_ID = sdm_oper.OPERATION_ID
--left join tb_panel_4m p4m on p4m.oper_code = sdm_oper.OPERATION_CODE
--	and job.JOB_NO = p4m.workorder
--left join dbo.erp_sdm_standard_equipment eqp
--	on p4m.eqp_code = eqp.EQUIPMENT_CODE
--where
--	job.JOB_NO in (select job_no from tb_panel_aoi_mapping where pnl_id = @pnl_id or cast(pnl_no as varchar) = @pnl_id)
--	and p4m.model_code = @model_code
--group by oper.OPERATION_SEQ_NO
--	,	sdm_oper.OPERATION_DESCRIPTION
--	, 	eqp.EQUIPMENT_DESCRIPTION
--order by oper.OPERATION_SEQ_NO asc
;