declare @query nvarchar(max);

with cte as
(
	select distinct
		a.model_code
	,	a.operation_code
	,	a.eqp_code
	,	b.raw_type
	,	b.table_name
	,	b.column_name
	from
		dbo.tb_param_model a
	join
		dbo.tb_param b
		on	a.eqp_code = b.eqp_code
		and	a.group_code = b.group_code
		and b.judge_yn = 'Y' --판정여부
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
	,	raw_type
	,	table_name
	,	string_agg(column_name, ',') as column_list
	from
		cte
	group by
		model_code, operation_code, eqp_code, raw_type, table_name
), cte3 as
(
	select
		formatmessage(
		'select 
			''%s'' as model_code
		,	''%s'' as operation_code
		,	''%s'' as eqp_code
		,	''%s'' as raw_type
		,	''%s'' as table_name
		,	(select top 1 %s from %s %s order by inserttime desc for json path, without_array_wrapper) as data_json'
		,	model_code
		,	operation_code
		,	eqp_code
		,	raw_type
		,	table_name
		,	column_list
		,	table_name
		,	case raw_type when 'P' then 'where equip = ''' + eqp_code + '''' else '' end
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