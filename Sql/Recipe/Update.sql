update
	dbo.tb_recipe
set
	group_code		= @group_code
,	recipe_name		= @recipe_name
,	base_val		= round(convert(float, @base_val),3)	
,	val1			= @val1			
,	interlock_yn	= @interlock_yn		
,	alarm_yn		= @alarm_yn						
,	remark			= @remark		
,	raw_type		= @raw_type
,	table_name		= @table_name
,	column_name		= @column_name
,	start_time		= cast(@start_time as int)
,	end_time		= cast(@end_time as int)
,	judge_yn		= @judge_yn
where
	corp_id			= @corp_id			
and fac_id			= @fac_id			
and eqp_code		= @eqp_code
and recipe_code		= @recipe_code		
and approve_key		= ''
;