delete from
    dbo.erp_wip_routing_tool 
where 
    WIP_OPERATION_ID in 
    (
        select 
            WIP_OPERATION_ID 
        from 
            dbo.erp_wip_operations 
        where 
            JOB_NO = @job_no 
    )
