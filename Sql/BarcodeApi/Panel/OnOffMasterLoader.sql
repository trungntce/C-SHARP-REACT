--�δ�����
select 
	count(*)  as cnt
from 
	tb_code 
where 
	codegroup_id = 'LOADER_CONTROL_BY_MODEL'
	and code_id = 'MASTER_LOADER'
	and use_yn = 'Y'