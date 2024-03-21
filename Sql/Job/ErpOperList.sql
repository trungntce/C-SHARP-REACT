select 
    *
from 
    APPS.WIP_OPERATIONS 
where 
    JOB_NO = :job_no 
order by
    WIP_OPERATION_ID