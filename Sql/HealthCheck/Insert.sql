insert into 
	dbo.tb_healthcheck
(
	hc_code
,	hc_type
,	hc_name
,	tags
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
)
select
	@hc_code
,	@hc_type
,	@hc_name
,	@tags
,	@use_yn
,	@sort
,	@remark
,	@create_user
,	getdate()
;