select
	distinct
	hc_code
,	hc_name
from
	tb_healthcheck th
where
	hc_type != 'S'
