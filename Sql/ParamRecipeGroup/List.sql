with cte_param as
(
	select
		group_code
	,	count(*) as cnt
	from
		dbo.tb_param
	group by
		group_code
), cte_recipe as
(
	select
		group_code
	,	count(*) as cnt
	from
		dbo.tb_recipe
	group by
		group_code
), cte_union as
(
	select distinct eqp_code, group_code from dbo.tb_param
	union
	select distinct eqp_code, group_code from dbo.tb_recipe
)
select
	cte_union.eqp_code
,	grp.*
,	isnull(p.cnt, 0)	as param_cnt
,	isnull(r.cnt, 0)	as recipe_cnt
from
	dbo.tb_param_recipe_group grp
left join
	cte_union
	on	grp.group_code = cte_union.group_code
left join
	cte_param p
	on	grp.group_code = p.group_code
left join
	cte_recipe r
	on	grp.group_code = r.group_code
where
	corp_id	= @corp_id
and	fac_id	= @fac_id
and	grp.group_code	like '%' + @group_code + '%'
and	grp.group_name	like '%' + @group_name + '%'
and cte_union.eqp_code = @eqp_code
and grp.group_code in (select group_code from dbo.tb_param where param_id = @param_id)
and grp.group_code in (select group_code from dbo.tb_param where param_name like '%' + @param_name + '%')
and grp.group_code in (select group_code from dbo.tb_recipe where recipe_code = @recipe_code)
and grp.group_code in (select group_code from dbo.tb_recipe where recipe_name like '%' + @recipe_name + '%')
;