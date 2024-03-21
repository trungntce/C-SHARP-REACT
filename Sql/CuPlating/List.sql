select
    * 
from 
   dbo.raw_cu_plating_10414 
where
   eqcode = @eq_code
and
   [time] >= cast(dateadd(dd,-@duration,GETDATE())as datetime)
ORDER BY
   [time] desc
;