select 
	OP_CLASS_CODE
,	OP_CLASS_DESCRIPTION
,   type.OP_TYPE_CODE
,   type.OP_TYPE_DESCRIPTION
from
   erp_sdm_operation_type 	type 
left join 
   erp_sdm_operation_class	class
   on type.OPERATION_CLASS_ID = class.OP_CLASS_ID
where
	class.SOB_ID = 90
	and class.ORG_ID = 901
	and ('' = @oper_type or type.OP_TYPE_CODE = @oper_type)
order by 
	OP_CLASS_CODE, OP_TYPE_CODE
;