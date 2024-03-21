select 
   *
from 
   dbo.tb_model_oper_ext
where
	(oper_yn = 'Y' or oper_yn = 'O')
and 
	model_code = @model_code
order by operation_seq_no 