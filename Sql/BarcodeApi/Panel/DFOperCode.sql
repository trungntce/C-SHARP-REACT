select 
	* 
from 
	tb_code 
where 
	codegroup_id = 'DF_4M_OPER'
	and use_yn = 'Y'
	and code_id = @oper_code
	