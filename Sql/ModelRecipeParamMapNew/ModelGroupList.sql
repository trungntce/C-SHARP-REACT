select 
		laser
	,	copper
	,	pt
	,	hp
	,	psr
	,	ir
	,	surface
	,	backend
from
	dbo.tb_model_registed_history
where model_code			= @model_code
and approve_key	=	''
and request_id = ''
;