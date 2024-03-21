insert into
	dbo.tb_exception
(
	event_id
,	[path]
,	method
,	query
,	body
,	host
,	client
,	ex_message
,	ex_source
,	ex_stacktrace
,	create_dt
)
select
	@event_id
,	@path
,	@method
,	@query
,	@body
,	@host
,	@client
,	@ex_message
,	@ex_source
,	@ex_stacktrace
,	getdate()
;
