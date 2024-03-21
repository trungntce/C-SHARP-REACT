--MADE BY SIFLEX
select * 
from tb_model_oper_ext
where model_code = @model_code
	and operation_seq_no = @operation_seq_no
	and operation_code = @operation_code
;