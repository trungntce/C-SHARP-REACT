select 
	a.error_no
,	a.error_type
,	a.ip_addr
,	a.oper_code
,	a.eqp_code
,	a.img_path
,	a.scan_dt
,	a.create_dt
from
	dbo.tb_panel_barcode_error a
where
	a.eqp_code = @eqp_code
and	a.ip_addr like '%' + @ip_addr + '%'
and	a.scan_dt >= @from_dt and a.scan_dt < @to_dt
order by
	a.scan_dt desc
;