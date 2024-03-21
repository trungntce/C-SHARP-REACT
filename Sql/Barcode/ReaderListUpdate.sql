with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			eqp_code varchar(40) '$.hcCode'
		,	create_dt datetime '$.lastDt'
		,	remark nvarchar(max) '$.remark'
		)
)
update
	dbo.tb_healthcheck_history 
set
	remark = cte.remark
from
	cte
join
	dbo.tb_healthcheck_history a
	on cte.create_dt = a.create_dt 
where
	cte.eqp_code = a.eqp_code
;