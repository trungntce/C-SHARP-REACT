update
	dbo.tb_model_approve_request
set
     approve_yn	=	'R'
,    note	= '[ ' + ( select user_name from tb_user where user_id = @create_user) + ' ]' + ' ' + @content
,    approve_user	=	@create_user
,    approve_dt	=	getdate()
where  approve_yn = 'N'
and request_id	= @request_id
and model_code		= @model_code	
;

update 
	dbo.tb_param_model_request_data
set 
	approve_key	=	(select approve_key from tb_param_approve_request_data where model_code = @model_code and approve_yn = 'N')
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_key	=	''
and request_id	= @request_id
and model_code	=	@model_code
;

update 
	dbo.tb_recipe_model_request_data
set 
	approve_key	= (select approve_key from tb_recipe_approve_request_data where model_code = @model_code and approve_yn = 'N')
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_key	=	''
and request_id	= @request_id
and model_code	=	@model_code
;

update
	dbo.tb_model_registed_history
set
	approve_key = (select approve_key from tb_recipe_approve_request_data where model_code = @model_code and approve_yn = 'N')
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	model_code = @model_code
and approve_key	=	''
and request_id = @request_id
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
	and request_id = @request_id
	and model_code	=	@model_code
)
begin
	update 
		dbo.tb_model_oper_ext_request
	set 
		approve_key = (select approve_key from tb_recipe_approve_request_data where model_code = @model_code and approve_yn = 'N')
	where
		corp_id   = @corp_id
	and fac_id    = @fac_id
	and	approve_key	=	''
	and request_id = @request_id
	and model_code	=	@model_code
end
;

update 
	dbo.tb_recipe_approve_request_data
set 
	approve_yn	=	'R'
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_yn	=	'N'
and model_code	=	@model_code
;

update 
	dbo.tb_param_approve_request_data
set 
	approve_yn	=	'R'
where
	corp_id   = @corp_id
and fac_id    = @fac_id
and	approve_yn	=	'N'
and model_code	=	@model_code
;
