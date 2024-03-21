with cte as
(
	select 
		symbolkey
	,	first_name
	,	last_name
	,	pick
	,	pvsv
	from 
		openjson(@json) 
		with 
		(
			symbolkey varchar(50) '$.symbolkey'
		,	first_name varchar(100) '$.firstName'
		,	last_name varchar(100) '$.lastName'
		,	pick varchar(100) '$.pick'
		,	pvsv varchar(100) '$.pvsv'
		)
)
update
	dbo.raw_plcsymbol_infotable
set
	symbolcomment = case when cte.first_name is null or cte.first_name = '' then '' else cte.first_name end + 
		case when cte.last_name is null or cte.last_name = '' then '' else '||' + cte.last_name end
	, updatetime = getdate()
	, pick = case when cte.pick is null or cte.pick = '' then '' else cte.pick end
	, pvsv = case when cte.pvsv is null or cte.pvsv = '' then '' else cte.pvsv end 
from 
	cte
join 
	dbo.raw_plcsymbol_infotable a 
 	on a.symbolkey = cte.symbolkey
where
	a.symbolkey = cte.symbolkey
;