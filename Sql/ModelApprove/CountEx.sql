select count(*) as cnt
from tb_model_approve_request
where  approve_yn = 'N'
and val1 is not null
and val2 is not null
and val3 is not null
and val4 is not null
and model_code	= @model_code
and request_id = @request_id