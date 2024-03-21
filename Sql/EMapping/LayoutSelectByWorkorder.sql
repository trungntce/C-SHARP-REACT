select
	*
from
	dbo.tb_emapping_layout layout
where
	layout.corp_id = @corp_id
and	layout.fac_id = @fac_id
and	layout.model_code = 
(
	select top 1 
		model_code 
	from 
		dbo.tb_panel_4m 
	where 
		workorder = @workorder 
	and len(model_code) > 0
	order by 
		create_dt
)
;