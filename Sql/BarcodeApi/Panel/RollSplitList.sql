select 
	trpm.roll_id,
	trpm.panel_id,
	tpl.interlock_code,
	tpl.on_update_user,
    tpl.on_remark,
    tpl.on_dt,
	tpd.defect_code 
from 
	tb_roll_panel_map trpm
left outer join 
	tb_panel_interlock tpl
on 
	trpm.panel_id = tpl.panel_id
left outer join
	tb_panel_defect tpd 
on 
	trpm.panel_id = tpd.panel_id
where
	trpm.roll_id = @barcode