with cte as
(
	select 
		errorgroup_code
	,	count(*)	as error_count
	,	max(sort)	as max_sort
	from 
		dbo.tb_error_code
	where
		corp_id			= @corp_id
	and	fac_id			= @fac_id
	group by
		errorgroup_code
)
select	
	a.errorgroup_code
,	a.errorgroup_name
,	a.use_yn
,	a.sort
,	a.remark
,	a.create_dt
,	a.create_user
,	a.update_dt
,	a.update_user
,	isnull(cte.error_count, 0)	as error_count
,	isnull(cte.max_sort, 0)		as max_sort
from 
	dbo.tb_errorgroup a
left join
	cte
	on a.errorgroup_code = cte.errorgroup_code
where
	a.corp_id			= @corp_id
and	a.fac_id			= @fac_id
and a.errorgroup_code	like '%' + @errorgroup_code + '%'
and	a.errorgroup_name	like '%' + @errorgroup_name + '%'
and a.use_yn			= @use_yn
order by
	a.create_dt desc
;