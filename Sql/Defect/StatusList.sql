select
	a.barcode_defect_no,
	a.ip_addr,
	a.barcode,
	a.defect_code,
	b.defect_name,
	a.create_dt
from
	dbo.tb_panel_barcode_defect a
left 
join tb_defect b
  on b.defect_code = a.defect_code 
where 
	a.create_dt between @from_dt and @to_dt
;