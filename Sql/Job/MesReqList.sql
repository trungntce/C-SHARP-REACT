select 
    *
from 
    dbo.erp_wip_requirements 
where 
    JOB_NO = @job_no
order by
    WIP_REQUIREMENT_ID    