--로더제어
select 
	count(*)  as cnt
from 
	tb_code 
where 
	codegroup_id = 'LOADER_CONTROL_BY_MODEL'
	and code_id = 'MODEL_LOADER'
	and use_yn = 'Y'