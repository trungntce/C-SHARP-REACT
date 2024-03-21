select
	corp_id
,	fac_id
,	row_key
,	roll_id
,	on_remark
,	off_remark
,	interlock_code
,	on_update_user
,	off_update_user
,	on_dt
,	off_dt
from 
	dbo.tb_roll_interlock
where
	corp_id		  	 = @corp_id
and	fac_id			 = @fac_id
and	roll_id			 like '%' + @roll_id + '%'
and interlock_code	 like '%' + @interlock_code + '%'
order by
	on_dt desc
;