delete from 
	dbo.tb_roll_hold
where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and	roll_id			= @roll_id
and on_dt			= @on_dt
;