select
    *
from 
    APPS.WIP_ROUTING_TOOL 
where 
    WIP_OPERATION_ID in 
    (
        select 
            WIP_OPERATION_ID 
        from 
            APPS.WIP_OPERATIONS 
        where 
            JOB_NO = :job_no 
    )
order by
    WIP_ROUTING_TOOL_ID 