select 
	SEF.CHEMICAL_NAME as chem_name
,	SEF.CHEMICAL_NAME + ' - ' + class.OP_CLASS_DESCRIPTION  as oper_description
from 
	dbo.fn_spc_eqp_measure_upv()   SEM
	INNER JOIN dbo.erp_spc_eqp_category             SEC ON SEC.EQP_CATEGORY_ID      = SEM.EQP_CATEGORY_ID
	INNER JOIN dbo.erp_spc_eqp_factor               SEF ON SEF.SPC_FACTOR_ID        = SEM.SPC_FACTOR_ID
	join dbo.erp_sdm_operation_class				class on class.OP_CLASS_ID = SEC.OP_CLASS_ID
where 
	1=1
	and class.OP_CLASS_CODE  = @oper_class
GROUP BY 
	SEF.CHEMICAL_NAME, class.OP_CLASS_DESCRIPTION  
union all
select 
	SEF.CHEMICAL_NAME
,	SEF.CHEMICAL_NAME + ' - ' + class.OP_CLASS_DESCRIPTION  as oper_description
from 
	dbo.erp_op_parameter_line  OPL
	INNER JOIN dbo.erp_op_parameter_header         OPH ON OPL.OP_PARAMETER_HEADER_ID = OPH.OP_PARAMETER_HEADER_ID
	INNER JOIN dbo.erp_spc_eqp_factor              SEF ON SEF.SPC_FACTOR_ID          = OPL.SPC_FACTOR_ID															AND SEF.EQP_CATEGORY_ID    	 = OPH.EQP_CATEGORY_ID
	INNER JOIN dbo.erp_spc_eqp_category            SEC ON SEF.EQP_CATEGORY_ID        = SEC.EQP_CATEGORY_ID
	join dbo.erp_sdm_operation_class				class on class.OP_CLASS_ID = SEC.OP_CLASS_ID
where 
	1=1
	and class.OP_CLASS_CODE  = @oper_class
GROUP BY 
	SEF.CHEMICAL_NAME, class.OP_CLASS_DESCRIPTION  