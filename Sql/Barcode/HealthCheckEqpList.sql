select
	distinct
	a.hc_code			as eqp_code
,	a.hc_name 			as eqp_desc
from
	dbo.tb_healthcheck a
where
	hc_type = 'E'
        