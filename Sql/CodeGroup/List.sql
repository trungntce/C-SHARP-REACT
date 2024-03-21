with cte as
(
	select 
		codegroup_id
	,	count(*)	as code_count
	,	max(sort)	as max_sort
	from 
		dbo.tb_code
	where
		corp_id			= @corp_id
	and	fac_id			= @fac_id
	group by
		codegroup_id
)
select	
	a.codegroup_id
,	a.codegroup_name
,	a.use_yn
,	a.sort
,	a.remark
,	a.create_dt
,	a.create_user
,	a.update_dt
,	a.update_user
,	isnull(cte.code_count, 0)	as code_count
,	isnull(cte.max_sort, 0)		as max_sort
from 
	dbo.tb_codegroup a
left join
	cte
	on a.codegroup_id = cte.codegroup_id
where
	a.corp_id			= @corp_id
and	a.fac_id			= @fac_id
and a.codegroup_id	like '%' + @codegroup_id + '%'
and	a.codegroup_name	like '%' + @codegroup_name + '%'
and a.use_yn			= @use_yn
order by
	a.create_dt desc
;