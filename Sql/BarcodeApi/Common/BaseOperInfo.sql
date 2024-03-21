select 
   *
from 
   dbo.tb_model_oper_ext
where 
   model_code = @model_code 
and  
	operation_seq_no = @oper_seq_no 
