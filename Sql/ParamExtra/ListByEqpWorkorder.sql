with cte as
(
	select
		param_id
	,	group_name
	,	param_name
	,	param_short_name
	,	cate_name
	,	unit
	,	std
	,	lcl
	,	ucl
	,	lsl
	,	usl
	,	100 as sort
	from
		dbo.tb_param_extra
	where
		eqp_id = @eqp_id
	and	(@group_id = '' OR group_id = @group_id)
	and	(@gubun1 = '' OR gubun1 = @gubun1)
	and	(@gubun2 = '' OR gubun2 = @gubun2)
	union all
	select
		a.param_id
	,	a.group_name
	,	a.param_name
	,	a.param_short_name
	,	a.cate_name
	,	a.unit
	,	a.std
	,	a.lcl
	,	a.ucl
	,	a.lsl
	,	a.usl
	,	1 as sort
	from
		dbo.tb_param_extra a
	join
		dbo.tb_param_workorder b
		on	a.corp_id = b.corp_id
		and	a.fac_id = b.fac_id
		and	a.param_id = b.param_id
	where
		b.workorder = @workorder
)
select
	*
from
	cte
order by
	cte.sort
;
