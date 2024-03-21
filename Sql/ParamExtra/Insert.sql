insert into
	dbo.tb_param_extra
(
	corp_id
,	fac_id
,	approve_key
,	eqp_code
,	param_id
,	group_code
,	group_name
,	gubun1
,	gubun2
,	param_name
,	param_short_name
,	cate_name
,	unit
,	std
,	lcl
,	ucl
,	lsl
,	usl
,	remark
,	interlock_yn
,	alarm_yn
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
,	dbo.fn_param_seq(@eqp_code)
,	@group_code
,	''
,	'I'
,	''
,	@param_name
,	@param_short_name
,	@cate_name
,	@unit
,	round(convert(float, @std),3)
,	round(convert(float, @lcl),3)
,	round(convert(float, @ucl),3)
,	round(convert(float, @lsl),3)
,	round(convert(float, @usl),3)
,	@remark
,	@interlock_yn
,	@alarm_yn
,	@raw_type
,	@table_name
,	@column_name
,	@create_user
,	getdate()
,	cast(@start_time as int)
,	cast(@end_time as int)
,	@judge_yn
;