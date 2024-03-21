select
	daily.*
,	sdm_eqp.EQUIPMENT_DESCRIPTION as eqp_desc
from
	tb_eqp_daily_index daily
join
	dbo.erp_sdm_standard_equipment sdm_eqp
	on daily.eqp_code = sdm_eqp.EQUIPMENT_CODE
where
	mes_date = @to_dt
	and eqp_code = @eqp_code 
