insert into
	dbo.tb_api_history
(
	[path]
,	method
,	query
,	request
,	token
,	host
,	client
,	create_dt
)
select
	@path
,	@method
,	@query
,	@request
,	@token
,	@host
,	@client
,	getdate()
;

select scope_identity();