with cte_di as 
(
	select
		*
	from
		openjson(@dijson)
		with
		(
			eqp_code 	varchar(40) '$.eqp_code'
		,	eqp_name	varchar(50)	'$.eqp_name'
		,	ago2month	int			'$.ago2month'
		,	ago1month	int			'$.ago2month'
		,	cur_month	int			'$.cur_month'
		,	ago7day		int			'$.ago7day'
		,	ago6day		int			'$.ago6day'
		,	ago5day		int			'$.ago5day'
		,	ago4day		int			'$.ago4day'
		,	ago3day		int			'$.ago3day'
		,	ago2day		int			'$.ago2day'
		,	ago1day		int			'$.ago1day'
		,	param_name  varchar(50) '$.param_name'
		)
),cte_input as 
(
	select
		*
	from
		openjson(@inputjson)
		with
		(
			eqp_code 	varchar(40) '$.eqp_code'
		,	eqp_name	varchar(50)	'$.eqp_name'
		,	ago2month	int			'$.ago2month'
		,	ago1month	int			'$.ago2month'
		,	cur_month	int			'$.cur_month'
		,	ago7day		int			'$.ago7day'
		,	ago6day		int			'$.ago6day'
		,	ago5day		int			'$.ago5day'
		,	ago4day		int			'$.ago4day'
		,	ago3day		int			'$.ago3day'
		,	ago2day		int			'$.ago2day'
		,	ago1day		int			'$.ago1day'
		,	param_name  varchar(50) '$.param_name'
		)
),cte_outuput as 
(
	select
		*
	from
		openjson(@outputjson)
		with
		(
			eqp_code 	varchar(40) '$.eqp_code'
		,	eqp_name	varchar(50)	'$.eqp_name'
		,	ago2month	int			'$.ago2month'
		,	ago1month	int			'$.ago2month'
		,	cur_month	int			'$.cur_month'
		,	ago7day		int			'$.ago7day'
		,	ago6day		int			'$.ago6day'
		,	ago5day		int			'$.ago5day'
		,	ago4day		int			'$.ago4day'
		,	ago3day		int			'$.ago3day'
		,	ago2day		int			'$.ago2day'
		,	ago1day		int			'$.ago1day'
		,	param_name  varchar(50) '$.param_name'
		)
)
select * from cte_di
union all
select * from cte_input
union all
select * from cte_outuput