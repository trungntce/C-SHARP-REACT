select 
	* 
from 
	fn_spc_status(@workorder)
where
	ipqc_status = 'NG'