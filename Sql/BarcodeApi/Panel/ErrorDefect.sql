select top 1
   tpd.panel_id
  ,tpd.defect_code
  ,tpd.on_remark
  ,tpd.off_remark
  ,tpd.on_update_user
  ,tpd.off_update_user
  ,tpd.on_dt
  ,tpd.off_dt
  ,tc.code_name
from
	tb_panel_defect tpd
join
	tb_code tc 
on
	tpd.defect_code  = tc.code_id
where 
  panel_id =@panel_id
and
	tc.codegroup_id='DEFECTREASON'
order by on_dt desc