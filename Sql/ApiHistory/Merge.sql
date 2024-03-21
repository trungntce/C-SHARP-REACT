merge into MESHIST.dbo.tb_api_history as target_tbl
using
(
	select
		@history_key	as history_key
	,	@path			as [path]
	,	@method			as method
	,	@query			as query
	,	@request		as request
	,	cast(@response as nvarchar(max))	as response
	,	@token			as token
	,	@host			as host
	,	@client			as client
) cte
on 
(
	target_tbl.history_key	= cte.history_key
)
when matched then
    update set
		target_tbl.[path]		= cte.[path]
	,	target_tbl.method		= cte.method
	,	target_tbl.query		= cte.query
	,	target_tbl.request		= cte.request
	,	target_tbl.response		= isnull(cte.response, target_tbl.response)
	,	target_tbl.token		= cte.token
	,	target_tbl.host			= cte.host
	,	target_tbl.client		= cte.client
	,	target_tbl.update_dt	= getdate()
when not matched then
    insert 
    (
		history_key
	,	[path]
	,	method
	,	query
	,	request
	,	response
	,	token
	,	host
	,	client
	,	create_dt
    )
    values
    (
		cte.history_key
	,	cte.[path]	
	,	cte.method	
	,	cte.query	
	,	cte.request	
	,	cte.response	
	,	cte.token	
	,	cte.host		
	,	cte.client	
	,	getdate()
    )
;