select
	*
from
	dbo.tb_emapping_layout layout
where
	layout.corp_id = @corp_id
and	layout.fac_id = @fac_id
and	layout.model_code = @model_code
;