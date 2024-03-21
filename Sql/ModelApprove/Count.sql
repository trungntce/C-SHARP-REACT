select count(*) as cnt
from tb_model_approve_request
where  rev_code is not null
and approve_yn = 'Y'
and model_code	= @model_code