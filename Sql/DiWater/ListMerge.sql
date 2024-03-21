with cte_di as 
(
	select
		eqp_code
	,	std_time
	,	value
	from
		openjson(@dijson)
		with
		(
			eqp_code 	varchar(40) '$.eqp_code'
		,	std_time	datetime	'$.std_time'
		,	value		float		'$.value'
		)
),cte_input as 
(
	select
		eqp_code
	,	std_time
	,	value
	from
		openjson(@inputjson)
		with
		(
			eqp_code 	varchar(40) '$.eqp_code'
		,	std_time	datetime	'$.std_time'
		,	value		float		'$.value'
		)
),cte_outuput as 
(
	select
		eqp_code
	,	std_time
	,	value
	from
		openjson(@outputjson)
		with
		(
			eqp_code 	varchar(40) '$.eqp_code'
		,	std_time	datetime	'$.std_time'
		,	value		float		'$.value'
		)
),cte_time as
(
        select
                std_time
        from
                cte_di
        union all
        select
                std_time
        from
                cte_input
        union all
        select
                std_time
        from
                cte_outuput
)select
		distinct 
	        *
	from
        cte_time 
;
