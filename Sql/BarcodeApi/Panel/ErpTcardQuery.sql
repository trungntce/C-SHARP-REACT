with cte as
(
	select 
		oper.OPERATION_SEQ_NO as seq
	,	max(oper.CREATION_DATE) as update_dt
	from 
		[dbo].[erp_wip_job_entities] job
	join
		[dbo].[erp_wip_operations] oper
		on  job.JOB_NO = oper.JOB_NO
	where 
		job.JOB_NO = @tcard
	group by 
		oper.OPERATION_SEQ_NO
), cte2 as
(
	select 
	    oper.OPERATION_SEQ_NO as seq
	,   sso.OPERATION_CODE AS oper_code
	,   case when @lang = 'KO-KR' then sso.OPERATION_DESCRIPTION
	        when @lang = 'VI-VN' then ssotl.OPERATION_DESCRIPTION
	        else  concat(concat(sso.OPERATION_DESCRIPTION, ' , '), ssotl.OPERATION_DESCRIPTION) end as oper_name
	from 
	    [dbo].[erp_wip_job_entities] job
	join
	    [dbo].[erp_wip_operations] oper
	    on  job.JOB_NO = oper.JOB_NO 
	join
	    [dbo].[erp_sdm_standard_operation] sso
	    on oper.OPERATION_ID = sso.OPERATION_ID
	left join
	    [dbo].[erp_sdm_standard_operation_tl] ssotl
	    on oper.OPERATION_ID = ssotl.OPERATION_ID
	join 
		cte
		on cte.update_dt = oper.CREATION_DATE
		and cte.seq = oper.OPERATION_SEQ_NO
	where 
	    job.JOB_NO = @tcard
)select 
	* 
from 
	cte2 
order by 
	seq;