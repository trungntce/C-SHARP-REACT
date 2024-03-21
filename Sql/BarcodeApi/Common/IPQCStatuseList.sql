select 
	count(*) as ng_cnt
from 
	dbo.erp_qm_inspection_op_header 
where 
	IPQC_FLAG = 'A'
and JOB_NO = @workorder
and IPQC_STATUS = 'NG'