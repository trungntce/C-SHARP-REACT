--바코드스캔시 PANEL_ITEM 인터락 여부
select 
	count(*) as cnt
from 
	tb_code 
where 
	codegroup_id = 'LOADER_CONTROL_BY_MODEL'
	and code_id = 'MASTER_SCANNER'
	and use_yn = 'Y'