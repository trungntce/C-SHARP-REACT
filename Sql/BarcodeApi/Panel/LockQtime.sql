select
   *
from
   dbo.erp_zsi_mes_qtime_list
where
   [STATUS] = 'LOCK'
and   JOB_NO = @workorder
and OP_UNLOCK_NO is null
;