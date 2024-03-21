select
	barcode
	, 'Thickness' as ng_type
	, up1_thickness
	, up2_thickness
	, up3_thickness
	, down1_thickness
	, down2_thickness
	, down3_thickness
from
	raw_blackhole_cmi_thickness
where
	barcode = @panel_id
and time = (select max(time) from  raw_blackhole_cmi_thickness where barcode = @panel_id)
group by 
	barcode, up1_thickness, up2_thickness, up3_thickness, down1_thickness, down2_thickness, down3_thickness