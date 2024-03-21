select top 1
  panel_id
  ,holding_code
  ,remark
  ,on_dt
  ,off_dt
from
  tb_panel_holding
where 
  panel_id =@panel_id
order by on_dt desc