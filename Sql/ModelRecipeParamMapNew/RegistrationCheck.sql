select count(*) cnt
from dbo.tb_model_registed_history
where model_code = @model_code
and	laser = 'Y'
and	copper = 'Y'
and	pt = 'Y'
and	hp = 'Y'
and	psr = 'Y'
and	ir = 'Y'
and	surface = 'Y'
and	backend = 'Y'
and approve_key	=	''
and request_id = ''
;