select
	count(*) as cnt
from
	dbo.tb_workorder_interlock
where
	workorder = @workorder
and	off_dt is null
;