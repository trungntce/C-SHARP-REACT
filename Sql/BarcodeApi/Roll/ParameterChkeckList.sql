declare @query nvarchar(max);

with cte as
(
	select distinct
		a.model_code
	,	a.operation_code
	,	a.eqp_code
	,	b.table_name
	,	b.column_name
	from
		dbo.tb_param_model a
	join
		dbo.tb_param b
		on	a.eqp_code = b.eqp_code
		and	a.param_id = b.param_id
	where
		len(b.table_name) > 0 
	and	len(b.column_name) > 0
	and a.model_code = @model_code
	and a.operation_seq_no =@oper_seq_no
	and a.eqp_code in (select [value] from string_split(@params, ','))
), cte2 as
(
	select
		model_code
	,	operation_code
	,	eqp_code
	,	table_name
	,	string_agg(column_name, ',') as column_list
	from
		cte
	group by
		model_code, operation_code, eqp_code, table_name
), cte3 as
(
	select
		formatmessage(
		'select 
			''%s'' as model_code
		,	''%s'' as operation_code
		,	''%s'' as eqp_code
		,	''%s'' as table_name
		,	(select top 1 %s from %s order by [time] desc for json path, without_array_wrapper) as data_json'
		,	model_code
		,	operation_code
		,	eqp_code
		,	table_name
		,	column_list
		,	table_name
		) as query
	from
		cte2
)
select
	@query = string_agg(query, ' union all ') 
from 
	cte3
;

print(@query);

execute sp_executesql @query;