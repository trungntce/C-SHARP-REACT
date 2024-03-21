-- 지정호기
select 
   eqp_json
from 
   dbo.tb_model_oper_ext
where 
   model_code = @model_code 
and   operation_seq_no = 2800