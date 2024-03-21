select
	[4m].*
,	oper.OPERATION_DESCRIPTION as oper_name
,	class.OP_CLASS_CODE as class_code
,	class.OP_CLASS_DESCRIPTION as class_name
from
	tb_oper_insp_matter_4m [4m]
join
	erp_sdm_standard_operation oper
	on [4m].oper_code = oper.OPERATION_CODE
join
	erp_sdm_operation_class class
	on oper.OPERATION_CLASS_ID = class.OP_CLASS_ID
where
	oper.SOB_ID = 90 
	and oper.ORG_ID = 901
	and [4m].oper_code = @oper_code
	and class.OP_CLASS_CODE = @class_code
;
