select
	exception_no
,	event_id
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

,	count(*) over() as total_count
from 
	dbo.tb_api_history
where
	create_dt >= @from_dt and create_dt < dateadd(day, 1, cast(@to_dt as date))

and	event_id		= @event_id
and	[path]			like '%' + @path + '%'
and	method			like '%' + @method + '%'
and	query			like '%' + @query + '%'
and	body			like '%' + @body + '%'
and	host			like '%' + @host + '%'
and	client			like '%' + @client + '%'

and	ex_message		like '%' + @ex_message + '%'
and	ex_source		like '%' + @ex_source + '%'
and	ex_stacktrace	like '%' + @ex_stacktrace + '%'

order by
	exception_no desc
offset 
	(@page_no - 1) * @page_size rows
fetch next 
	@page_size rows only
;