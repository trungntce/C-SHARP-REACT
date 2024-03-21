select distinct
	model_code
from
	dbo.tb_model_oper_ext_request
where approve_key = ''
order by
	model_code
;