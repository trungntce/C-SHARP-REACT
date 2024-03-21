select count(*) as cnt
from tb_model_approve_request
where  approve_yn = 'N'
and model_code	= @model_code
and request_id = @request_id