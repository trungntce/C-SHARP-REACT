select
    dasinserttime
,   mesdate
,   equip
,	[time]
,	inserttime
	{1}
from 
	dbo.{0}
where
	equip = @eqp_code
and	inserttime >=  @from_dt and inserttime < @to_dt
order by
	inserttime  desc
offset
	(@page_no - 1) * @page_size rows
fetch next
	@page_size rows only
;