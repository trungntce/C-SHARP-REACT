insert into
	dbo.tb_recipe_template_data
(
	data_key
,	filename
,	filelocation
,	data_type
,	create_user
,	create_dt
)
select
	@data_key
,	@filename
,	@filelocation
,	@data_type
,	@create_user
,	getdate()
;