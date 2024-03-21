delete from 
	dbo.tb_roll_rework
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	roll_id			= @roll_id
and put_dt			= @put_dt
;