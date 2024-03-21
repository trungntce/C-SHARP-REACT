select
	code_id
,	code_name
,	remark
from 
	tb_code 
where 
	corp_id = @corp_id
and
	fac_id = @fac_id
and
	codegroup_id = 'HOLDINGREASON' 
and 
	len(code_id) = 4
order by
	sort
;