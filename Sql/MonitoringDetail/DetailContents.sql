select
	eqp_code 
,	mes_date 
,	time_rate 
,	perfor_rate 
,	st
from
	tb_eqp_daily_index tedi 
where
	eqp_code = @eqp_code
	and mes_date <= Dateadd(dd,-1,@mes_dt)
	and mes_date >= Dateadd(dd,-8,@mes_dt)
;