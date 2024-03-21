with cte as 
(
	select
    	a.model_code
    ,	max(a.approve_dt) as approve_dt
	,	max(SIR.BOM_ITEM_DESCRIPTION) as model_description
	from
		tb_recipe_model_approve a
	inner join 
		tb_param_model_approve b 
	  on a.model_code = b.model_code 
	 and a.approve_key = b.approve_key
	left join
		dbo.erp_sdm_item_revision SIR
	  on SIR.BOM_ITEM_CODE = a.model_code
	where 
		a.corp_id 		= @corp_id
	and a.fac_id 		= @fac_id
	and a.model_code 	= @model_code
	group by a.model_code 
),cte2 as 
(
	select
		cte.model_code
    ,   cte.model_description
    ,   cte.approve_dt
    ,   (select approve_yn from tb_recipe_model_approve where model_code = cte.model_code and approve_dt = cte.approve_dt) as approve_yn
    ,   (select approve_key from tb_recipe_model_approve where model_code = cte.model_code and approve_dt = cte.approve_dt) as approve_key
from cte
)
select 
	cte2.*
,	isnull(code.code_name,'') as code_name 
from 
	cte2
join
	tb_code code
	on cte2.approve_yn = code.code_id 
where code.codegroup_id = 'APPROVAL_TYPE'