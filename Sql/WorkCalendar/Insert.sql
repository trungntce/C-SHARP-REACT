insert into
	dbo.tb_calendar
(	corp_id,
	fac_id,
	work_date,
	worker_id,
	off_date,
	work_yn,
	shift_type,
	remark,
	create_dt,
	create_user
)
select
	@corp_id,
	@fac_id,
	@work_date,
	@worker_id,
	@off_date,
	@work_yn,
	@shift_type,
	@remark,
	getdate(),
	@create_user
;

