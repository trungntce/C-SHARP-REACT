update
	dbo.tb_param_extra
set
	group_code		= @group_code
,	group_name		= @group_name
,	gubun1			= @gubun1			
,	gubun2			= @gubun2
,	param_name		= @param_name
,	param_short_name= @param_short_name
,	cate_name		= @cate_name
,	unit			= @unit
,	std				= round(convert(float, @std),3)
,	lcl				= round(convert(float, @lcl),3)
,	ucl				= round(convert(float, @ucl),3)
,	lsl				= round(convert(float, @lsl),3)
,	usl				= round(convert(float, @usl),3)
,	remark			= @remark		
,	interlock_yn	= @interlock_yn		
,	alarm_yn		= @alarm_yn						
,	raw_type		= @raw_type
,	table_name		= @table_name
,	column_name		= @column_name
,	update_user		= @update_user
,	update_dt		= getdate()
,	start_time		= cast(@start_time as int)
,	end_time		= cast(@end_time as int)
,	judge_yn		= @judge_yn
where
	corp_id			= @corp_id			
and fac_id			= @fac_id			
and eqp_code		= @eqp_code
and param_id		= @param_id		
and approve_key		= ''
;