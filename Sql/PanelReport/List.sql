select 
	a.panel_id
,	a.ip_addr
,	a.oper_code
,	a.eqp_code
,	a.worker_code
,	a.material_code
,	a.tool_code
,	a.scan_dt
,	a.create_dt
from
	dbo.tb_panel_barcode a
where
	a.eqp_code = @eqp_code
and	a.ip_addr like '%' + @ip_addr + '%'
and	a.scan_dt >= @from_dt and a.scan_dt < dateadd(day, 1, cast(@to_dt as date))
order by
	a.scan_dt desc
;