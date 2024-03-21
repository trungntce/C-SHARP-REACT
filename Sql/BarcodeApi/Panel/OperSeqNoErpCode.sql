--4M 에러프루핑
select 
	count(*) as cnt
from 
	tb_code 
where 
	codegroup_id = 'LOADER_CONTROL_BY_MODEL'
	and code_id = 'ERP_OPER_CHECK'
	and use_yn = 'Y'