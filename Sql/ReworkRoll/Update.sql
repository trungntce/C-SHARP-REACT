update
	dbo.tb_roll_rework
set
	oper_seq		= @oper_seq
,	oper_code		= @oper_code
,	oper_name		= @oper_name
,	put_remark		= @put_remark
,	rework_code		= @rework_code
,	put_update_user = @put_update_user
,	put_dt = GETDATE()
where
	corp_id		     = @corp_id
and	fac_id			 = @fac_id
and	roll_rework_id	 = @roll_rework_id
;
