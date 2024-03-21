insert into
	dbo.tb_worker
(	corp_id,
	fac_id,
	worker_id,
	worker_name,
	row_key,
	create_dt,
	create_user
)
select
	@corp_id
,	@fac_id
,	@worker_id
,	@worker_name
,	@row_key
,	getdate()
,	@create_user
;
