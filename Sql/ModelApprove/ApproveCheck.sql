select count(*) as cnt
from dbo.tb_model_approve_request
where model_code = @model_code
and approve_yn = 'N'