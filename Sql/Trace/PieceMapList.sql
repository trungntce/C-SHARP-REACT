select
	map.*
,	sdm_oper.OPERATION_DESCRIPTION	as oper_name
from
	dbo.tb_panel_piece_map map
join
	dbo.erp_sdm_standard_operation sdm_oper
	on	map.oper_code = sdm_oper.OPERATION_CODE
where
	map.panel_id = @panel_id
;