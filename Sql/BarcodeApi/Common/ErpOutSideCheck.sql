select 
	OWNER_TYPE_LCODE 
from 
	erp_wip_operations WOS 
INNER JOIN 
	erp_sdm_standard_resource   SSR 
on
	WOS.RESOURCE_ID = SSR.RESOURCE_ID
INNER JOIN 
	erp_sdm_standard_workcenter SSW 
on
	SSR.WORKCENTER_ID = SSW.WORKCENTER_ID
where 
	JOB_NO = @workorder
and 
	OPERATION_SEQ_NO = @oper_seq_no
;

