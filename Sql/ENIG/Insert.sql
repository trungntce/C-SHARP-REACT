with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			eqp_code varchar(40) '$.eqcode'
		,	insert_remark varchar(200) '$.insertRemark'
		,	min_value	float	'$.minValue'
		,	max_value	float	'$.maxValue'
		,	start_dt	datetime	'$.originTime'
		,	end_dt		datetime	'$.originendTime'
		)
),cte2 as
(
	select
		eqp_code
	,	insert_remark
	,	min_value
	,	max_value
	,	start_dt
	,	end_dt
	,	getdate() as insert_dt
	from
		cte
	where
		insert_remark is not null
		and insert_remark != ''
)
insert into dbo.tb_diwater_down_history
select * from cte2