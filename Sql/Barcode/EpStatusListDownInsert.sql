with cte as 
(
	select
		*
	from
		openjson(@json)
		with
		(
			eqp_code varchar(40) '$.hcCode'
		,	type_code varchar(2) '$.hcType'
		,	create_dt datetime '$.lastDt'
		,	remark nvarchar(max) '$.remark'
		)
),cte2 as 
(
	select
		eqp_code as eqp_code 
	,	type_code	as type_code
	,	getdate() as insert_dt
	,	remark as insert_remark
	from
		cte
	where
		remark is not null
		and remark != ''
)
insert into dbo.tb_healthcheck_down_his
select * from cte2
