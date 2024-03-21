select 
	top 1
	app_ver,
	app_path,
	app_nm,
	host,
	[port],
	username,
	[password],
	protocol,
	has_login
from tb_checksheet_app_ver
where app_ver > @app_ver
order by app_ver desc
;