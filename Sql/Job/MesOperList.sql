select 
    *
from 
    dbo.erp_wip_operations 
where 
    JOB_NO = @job_no 
order by
    WIP_OPERATION_ID  