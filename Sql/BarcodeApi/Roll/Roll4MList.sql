select top 1
	 corp_id
	,fac_id
	,row_no
	,row_dt
	,row_key
	,group_key
	,device_id
	,workorder
	,oper_code
	,eqp_code
	,worker_list
	,material_list
	,tool_list
	,scan_dt
	,create_dt
	,start_dt
	,end_dt
from dbo.tb_roll_4m
where workorder = @workorder
order by row_no desc
