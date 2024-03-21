select
	corp_id
,	fac_id
,	row_key
,	roll_id
,	on_remark
,	off_remark
,	defect_code
,	on_update_user
,	off_update_user
,	on_dt
,	off_dt
from 
	dbo.tb_roll_defect
where
	corp_id		  	 = @corp_id
and	fac_id			 = @fac_id
and	roll_id 		 = @roll_id
and defect_code		 = @defect_code
order by
	on_dt desc
;