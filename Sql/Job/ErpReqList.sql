select 
    *
from 
    APPS.WIP_REQUIREMENTS 
where 
    JOB_NO = :job_no
order by
    WIP_REQUIREMENT_ID