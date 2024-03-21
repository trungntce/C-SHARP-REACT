select top 1
   tpi.panel_id
  ,tpi.interlock_code
  ,tpi.on_remark
  ,tpi.off_remark
  ,tpi.on_update_user
  ,tpi.off_update_user
  ,tpi.on_dt
  ,tpi.off_dt
  ,tc.code_name
from
	tb_panel_interlock tpi
join
	tb_code tc 
on
	tpi.interlock_code  = tc.code_id
where 
	panel_id =@panel_id
and
	tc.codegroup_id='HOLDINGREASON'
order by on_dt desc