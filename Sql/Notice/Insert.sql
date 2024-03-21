insert into 
	dbo.tb_notice
(
	corp_id
,	fac_id
,	title
,	body
,	start_dt
,	end_dt
,	use_yn
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@title
,	@body
,	@start_dt
,	@end_dt
,	@use_yn
,	@create_user
,	getdate()
;