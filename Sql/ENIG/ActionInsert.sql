if exists(
	select 
		* 
	from 
		dbo.tb_action_taken 
	where eqp_name = @eqcode
		and (@min_dt between start_dt and end_dt or @max_dt between start_dt and end_dt)
)
begin 
	update dbo.tb_action_taken 
	set
		remark = @remark
	,	end_dt = @max_dt
	where
		(start_dt between @min_dt and @max_dt or end_dt between @min_dt and @max_dt)
end
else
begin 
	insert	into dbo.tb_action_taken
	(
		eqp_name
	,	start_dt 
	,	end_dt 
	,	remark 
	,	inserttime 
	)
	values
	(
		@eqcode
	,	@min_dt
	,	@max_dt
	,	isnull(@remark,null)
	,	getdate()
	)
end