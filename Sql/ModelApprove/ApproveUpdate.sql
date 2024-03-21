if( 'group.approve' = (
	SELECT 
		JSON_TABLE.value
	FROM tb_user as a
	CROSS APPLY OPENJSON(a.usergroup_json) AS JSON_TABLE
	WHERE a.user_id = @create_user
	and JSON_TABLE.value = 'group.approve'))
begin
	update
		dbo.tb_model_approve_request
	set
		 rev_code	= @rev_code
	,    approve_yn	=	'Y'
	,    note	= '[ ' + ( select user_name from tb_user where user_id = @create_user) + ' ]' + ' ' + @content
	,    approve_user	=	@create_user
	,    approve_dt	=	getdate()
	where  approve_yn = 'N'
	and request_id	= @request_id
	and model_code		= @model_code
	;

	delete from dbo.tb_recipe_model where model_code	=	@model_code;

	insert into
		dbo.tb_recipe_model
	(
		corp_id
	,	fac_id
	,	approve_key
	,	model_code
	,	operation_seq_no
	,	operation_code
	,	workcenter_code
	,	eqp_code
	,	group_code
	,	interlock_yn
	,	remark
	,	create_user
	,	create_dt
	)
	select
		corp_id
	,	fac_id
	,	''
	,	model_code
	,	operation_seq_no
	,	operation_code
	,	workcenter_code
	,	eqp_code
	,	group_code
	,	interlock_yn
	,	''
	,	create_user
	,	create_dt
	from
		dbo.tb_recipe_model_request_data
	where
		corp_id				= 'SIFLEX'
	and fac_id				= 'SIFLEX'
	and	approve_key	=	''
	and request_id	= @request_id
	and model_code	=	@model_code
	;

	delete from dbo.tb_param_model where model_code	=	@model_code;

	insert into
		dbo.tb_param_model
	(
		corp_id
	,	fac_id
	,	approve_key
	,	model_code
	,	operation_seq_no
	,	operation_code
	,	workcenter_code
	,	eqp_code
	,	group_code
	,	interlock_yn
	,	remark
	,	create_user
	,	create_dt
	)
	select
		corp_id
	,	fac_id
	,	''
	,	model_code
	,	operation_seq_no
	,	operation_code
	,	workcenter_code
	,	eqp_code
	,	group_code
	,	interlock_yn
	,	''
	,	create_user
	,	create_dt
	from
		dbo.tb_param_model_request_data
	where
		corp_id				= 'SIFLEX'
	and fac_id				= 'SIFLEX'
	and	approve_key	=	''
	and request_id	= @request_id
	and model_code	=	@model_code
	;

	IF EXISTS (
  		select 
			* 
		from 
			dbo.tb_model_oper_ext_request
		where
			corp_id   = 'SIFLEX'
		and fac_id    = 'SIFLEX'
		and	approve_key	=	''
		and request_id = @request_id
		and model_code	=	@model_code
	)
	begin
		delete from
			dbo.tb_model_oper_ext
		where 
			corp_id				= 'SIFLEX'
		and fac_id				= 'SIFLEX'
		and	model_code			= @model_code
		;

		insert into
			dbo.tb_model_oper_ext
		(
			corp_id
		,	fac_id
		,	model_code
		,	operation_seq_no
		,	operation_code
		,	oper_yn
		,	scan_eqp_yn
		,	scan_worker_yn
		,	scan_material_yn
		,	scan_tool_yn
		,	scan_panel_yn
		,	scan_type
		,	start_yn
		,	end_yn
		,	rework_yn
		,	split_yn
		,	merge_yn
		,	remark
		,	eqp_json
		,	create_user
		,	create_dt
		)
		select
			corp_id
		,	fac_id
		,	model_code
		,	operation_seq_no
		,	operation_code
		,	oper_yn
		,	scan_eqp_yn
		,	scan_worker_yn
		,	scan_material_yn
		,	scan_tool_yn
		,	scan_panel_yn
		,	scan_type
		,	start_yn
		,	end_yn
		,	rework_yn
		,	split_yn
		,	merge_yn
		,	remark
		,	eqp_json
		,	create_user
		,	create_dt
		from
			dbo.tb_model_oper_ext_request
		where 
			corp_id				= 'SIFLEX'
		and fac_id				= 'SIFLEX'
			and	model_code	= @model_code
			and	approve_key	=	''
			and request_id	= @request_id
		;

		update 
		dbo.tb_model_oper_ext_request
		set 
			approve_key = (select approve_key from tb_recipe_approve_request_data where model_code = @model_code and approve_yn = 'N')
		where
			corp_id   = 'SIFLEX'
		and fac_id    = 'SIFLEX'
		and	approve_key	=	''
		and request_id = @request_id
		and model_code	=	@model_code
		;
	end
	;

	update 
		dbo.tb_param_model_request_data
	set 
		approve_key	=	(select approve_key from tb_param_approve_request_data where model_code = @model_code and approve_yn = 'N')
	where
		corp_id				= 'SIFLEX'
	and fac_id				= 'SIFLEX'
	and	approve_key	=	''
	and request_id	= @request_id
	and model_code	=	@model_code
	;

	update 
		dbo.tb_recipe_model_request_data
	set 
		approve_key	= (select approve_key from tb_recipe_approve_request_data where model_code = @model_code and approve_yn = 'N')
	where
		corp_id				= 'SIFLEX'
	and fac_id				= 'SIFLEX'
	and	approve_key	=	''
	and request_id	= @request_id
	and model_code	=	@model_code
	;

	update
	dbo.tb_model_registed_history
	set
		approve_key = (select approve_key from tb_recipe_approve_request_data where model_code = @model_code and approve_yn = 'N')
	where
		corp_id   = 'SIFLEX'
	and fac_id    = 'SIFLEX'
	and	model_code = @model_code
	and approve_key	=	''
	and request_id = @request_id
	;

	update 
		dbo.tb_recipe_approve_request_data
	set 
		approve_yn	=	'Y'
	where
		corp_id				= 'SIFLEX'
	and fac_id				= 'SIFLEX'
	and	approve_yn	=	'N'
	and model_code	=	@model_code
	;

	update 
		dbo.tb_param_approve_request_data
	set 
		approve_yn	=	'Y'
	where
		corp_id				= 'SIFLEX'
	and fac_id				= 'SIFLEX'
	and	approve_yn	=	'N'
	and model_code	=	@model_code
	;
end
;