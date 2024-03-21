insert into 
	dbo.tb_lang_code
(
	corp_id
,	fac_id
,	lang_code
,	nation_code
,	lang_text
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@lang_code
,	@nation_code
,	@lang_text
,	@create_user
,	getdate()
;