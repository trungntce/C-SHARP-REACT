insert into
	dbo.tb_recipe
(	
	corp_id
,	fac_id
,	approve_key
,	eqp_code
,	recipe_code
,	group_code
,	recipe_name
,	base_val
,	val1
,	interlock_yn
,	alarm_yn
,	remark
,	raw_type
,	table_name
,	column_name
,	create_user
,	create_dt
,	start_time
,	end_time
,	judge_yn
)
select
	@corp_id
,	@fac_id
,	''
,	@eqp_code
,	dbo.fn_recipe_seq(@eqp_code)
,	@group_code
,	@recipe_name
,	round(convert(float, @base_val),3)
,	@val1
,	@interlock_yn
,	@alarm_yn
,	@remark
,	@raw_type
,	@table_name
,	@column_name
,	@create_user
,	getdate()
,	cast(@start_time as int)
,	cast(@end_time as int)
,	@judge_yn
;