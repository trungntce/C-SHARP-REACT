declare @group_code_tbl table
(
	group_code	varchar(30)
)
;

insert into
	dbo.tb_param_recipe_group
(
	corp_id
,	fac_id
,	group_code
,	group_name
,	create_user
,	create_dt
)
output
	inserted.group_code into @group_code_tbl(group_code)
select
	@corp_id
,	@fac_id
,	dbo.fn_param_recipe_group_key()
,	@group_name
,	@create_user
,	getdate()
;

select group_code from @group_code_tbl
;