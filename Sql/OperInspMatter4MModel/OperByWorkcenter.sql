select distinct 
	sdm_oper.OPERATION_CODE as oper_code
,	sdm_oper.OPERATION_DESCRIPTION as oper_desc
,	work.WORKCENTER_CODE as workcenter
from 
	dbo.erp_wip_operations oper
left join
	dbo.erp_sdm_standard_operation sdm_oper
	on oper.OPERATION_ID = sdm_oper.OPERATION_ID
	and sdm_oper.SOB_ID = 90 
	and sdm_oper.ORG_ID = 901
left join
	dbo.erp_sdm_standard_workcenter work
	on oper.WORKCENTER_ID = work.WORKCENTER_ID
	and work.SOB_ID = 90 
	and work.ORG_ID = 901
where
	1=1
	and work.WORKCENTER_CODE = @workcenter