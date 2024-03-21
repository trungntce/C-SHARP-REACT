update 
	dbo.tb_model_registed_history
set 
	request_id = @request_id
where
    corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_key	=	''
and request_id = ''
and model_code	=	@model_code
;

IF EXISTS (
  	select 
		* 
	from 
		dbo.tb_model_oper_ext_request
	where
		corp_id   = @corp_id
	and fac_id    = @fac_id
	and	approve_key	=	''
	and request_id = ''
	and model_code	=	@model_code
)
begin
	update 
		dbo.tb_model_oper_ext_request
	set 
		request_id = @request_id
	where
		corp_id   = @corp_id
	and fac_id    = @fac_id
	and	approve_key	=	''
	and request_id = ''
	and model_code	=	@model_code
end
;

update 
	dbo.tb_recipe_approve_request_data
set 
	approve_yn	=	'N'
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_yn	=	'S'
and model_code	=	@model_code
;

update 
	dbo.tb_param_approve_request_data
set 
	approve_yn	=	'N'
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_yn	=	'S'
and model_code	=	@model_code
;

update 
	dbo.tb_param_model_request_data
set 
	request_id = @request_id
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_key	=	''
and model_code	=	@model_code
;

update 
	dbo.tb_recipe_model_request_data
set 
	request_id = @request_id
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_key	=	''
and model_code	=	@model_code
;

insert into 
    dbo.tb_model_approve_request
(
     request_id 
,    rev_code
,    model_code
,    model_name
,    type
,    filelocation
,    val1
,    val2
,    val3
,	 val4
,    approve_yn
,    rev_note
,    reason_note
,    note
,    create_user
,    create_dt
,    approve_user
,    approve_dt
)
select
     @request_id
,    ''
,    @model_code
,    @model_name
,    @type
,    @filelocation
,    null
,    null
,    null
,    null
,    'N'
,    @rev_note
,    null
,    null
,    @create_user
,    getdate()
,    null
,    null
;