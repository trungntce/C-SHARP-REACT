
select 
	trpm.panel_id,
	trpm.workorder,
	trpm.oper_seq_no,
	trpm.oper_code,
	tpr.interlock_yn,
	tpr.defect_yn,
	tpr.rework_approve_yn
from 
	tb_roll_panel_map trpm
join 
	tb_panel_realtime tpr
on 
	trpm.panel_id = tpr.panel_id
where 
	trpm.panel_id = @panel_id