select
	* 
from 
	dbo.raw_cu_plating_10414 
where 
	eqcode = @eq_code
AND [time] > @last_dt AND [time] <= GETDATE()
order by
	[time] desc