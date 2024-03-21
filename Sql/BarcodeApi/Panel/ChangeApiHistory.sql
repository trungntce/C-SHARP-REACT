insert into 
	dbo.tb_api_history
(
	row_key
,	group_key
,	body_json
,	remark
,	request_user
,	request_dt
)
select
	@row_key
,	@group_key
,	@body_json
,	@remark
,	@request_user
,	getdate()