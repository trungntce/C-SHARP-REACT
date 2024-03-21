select count(*) as cnt
from dbo.tb_model_oper_ext_request
where model_code = @model_code
and request_id = @request_id
;