select
	history_no
,	[path]
,	method
,	query
,	request
,	response
,	token
,	host
,	client
,	create_dt
,	update_dt

,	count(*) over() as total_count
from 
	dbo.tb_api_history
where
	create_dt >= @from_dt and create_dt < dateadd(day, 1, cast(@to_dt as date))
and	[path]			= @path
and	method			like '%' + @method + '%'
and	query			like '%' + @query + '%'
and	request			like '%' + @request + '%'
and	response		like '%' + @response + '%'
and	token			like '%' + @token + '%'
and	host			like '%' + @host + '%'
and	client			like '%' + @client + '%'
order by
	history_no desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;