with cte as 
(
	select
		group_code
	,	max(group_name) as group_name
	,	max(remark) as remark
	,	max(eqp_code) as eqp_code
	from
	(
		select 
			a.group_code
			, max(grp.group_name) as group_name
			, max(a.remark) as remark
			, max(a.eqp_code) as eqp_code
		from 
			dbo.tb_recipe a
		left outer join 
			dbo.tb_param_recipe_group grp
		  on grp.group_code = a.group_code
		where
			a.corp_id   = @corp_id
		and a.fac_id    = @fac_id
		and a.eqp_code  = @eqp_code
		and a.approve_key = ''
		and a.group_code != ''
		group by a.group_code
		union
		select 
			a.group_code
			, max(grp.group_name) as group_name
			, max(a.remark) as remark
			, max(a.eqp_code) as eqp_code
		from 
			dbo.tb_param a
		left outer join 
			dbo.tb_param_recipe_group grp
		  on grp.group_code = a.group_code
		where
			a.corp_id   = @corp_id
		and a.fac_id    = @fac_id
		and a.eqp_code  = @eqp_code
		and a.approve_key = ''
		and a.group_code != ''
		group by a.group_code
	) a
	group by group_code
),
cte2 as 
(
	select 
		a.*
		, b.model_code as exist
		, 'N' as recipe_change_yn
	from 
		cte a
	left join
		dbo.tb_recipe_model b
	  on b.group_code = a.group_code
	 and b.eqp_code = a.eqp_code
	 and b.approve_key  = ''
	 and b.model_code = @model_code
	 and b.operation_seq_no = @operation_seq_no
	 union 
	 select 
		a.*
		, b.model_code as exist
		, 'N' as recipe_change_yn
	from 
		cte a
	left join
		dbo.tb_param_model b
	  on b.group_code = a.group_code
	 and b.eqp_code = a.eqp_code
	 and b.approve_key  = ''
	 and b.model_code = @model_code
	 and b.operation_seq_no = @operation_seq_no
)
select distinct 
	group_code
,	max(group_name) as group_name
,	max(remark) as remark
,	max(eqp_code) as eqp_code
,	max(exist) as exist
,	max(recipe_change_yn) as recipe_change_yn
from 
	cte2
group by
	group_code
;