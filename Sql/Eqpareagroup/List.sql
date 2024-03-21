with cte as
(
	select 
		eqpareagroup_code
	,	count(*)	as eqp_count
	,	max(sort)	as max_sort
	from 
		dbo.tb_eqparea
	where
		corp_id			= @corp_id
	and	fac_id			= @fac_id
	group by
		eqpareagroup_code
)
select
	a.eqp_code
,	a.eqpareagroup_code
,	a.eqpareagroup_name
,	a.use_yn
,	a.sort
,	a.remark
,	a.create_dt
,	a.create_user
,	a.update_dt
,	a.update_user
,	isnull(cte.eqp_count, 0)	as eqp_count
,	isnull(cte.max_sort, 0)		as max_sort
,	sse.EQUIPMENT_DESCRIPTION as eqp_name
,	b.usergroup_id as recipe_code
,	b.usergroup_name as recipe_name
from
	dbo.tb_eqpareagroup a
left join 
	cte
	on a.eqpareagroup_code= cte.eqpareagroup_code
left join erp_sdm_standard_equipment sse
	on sse.EQUIPMENT_CODE = a.eqp_code
left join tb_usergroup b
	on b.usergroup_id = a.usergroup_id
where
	a.corp_id			= @corp_id			
and a.fac_id			= @fac_id			
and a.eqp_code			= @eqp_code
and a.eqpareagroup_code	like '%' + @eqpareagroup_code + '%'
and	a.eqpareagroup_name	like '%' + @eqpareagroup_name + '%'
and a.use_yn			= @use_yn
order by 
	a.create_dt desc
;