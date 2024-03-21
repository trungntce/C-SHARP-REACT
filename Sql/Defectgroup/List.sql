with cte as
(
	select 
		defectgroup_code
	,	count(*)	as defect_count
	,	max(sort)	as max_sort
	from 
		dbo.tb_defect
	where
		corp_id			= @corp_id
	and	fac_id			= @fac_id
	group by
		defectgroup_code
)
select	
	a.defectgroup_code
,	a.defectgroup_name
,	a.use_yn
,	a.sort
,	a.remark
,	a.create_dt
,	a.create_user
,	a.update_dt
,	a.update_user
,	isnull(cte.defect_count, 0)	as defect_count
,	isnull(cte.max_sort, 0)		as max_sort
from 
	dbo.tb_defectgroup a
left join
	cte
	on a.defectgroup_code = cte.defectgroup_code
where
	a.corp_id			= @corp_id
and	a.fac_id			= @fac_id
and a.defectgroup_code	like '%' + @defectgroup_code + '%'
and	a.defectgroup_name	like '%' + @defectgroup_name + '%'
and a.use_yn			= @use_yn
order by
	a.create_dt desc
;