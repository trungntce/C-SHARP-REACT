update
	dbo.tb_recipe_model_approve
set
	approve_yn	= @approve_yn,
	update_user = @update_user,
	update_dt	= getdate()
where
	corp_id		= @corp_id		
and fac_id		= @fac_id		
and model_code	= @model_code
and approve_key = @approve_key
;

with cte as 
(
	select 
		a.*
	from dbo.tb_recipe a  
	join dbo.tb_recipe_model b on b.eqp_code = a.eqp_code and b.group_code = a.group_code and a.approve_key = '' 
	where 
		a.corp_id		= @corp_id
	and a.fac_id		= @fac_id
	and b.model_code	= @model_code
	and b.approve_key 	= ''
)
insert into 
	dbo.tb_recipe 
(	
	corp_id
,	fac_id
,	approve_key
,	eqp_code
,	recipe_code
,	group_code
,	recipe_name
,	base_val
,	val1
,	interlock_yn
,	alarm_yn
,	remark
,	raw_type
,	table_name
,	column_name
,	create_user
,	create_dt
,	judge_yn
)
select
	cte.corp_id
,	cte.fac_id
,	@approve_key
,	cte.eqp_code
,	cte.recipe_code
,	cte.group_code
,	cte.recipe_name
,	round(convert(float, cte.base_val),3)
,	cte.val1
,	cte.interlock_yn
,	cte.alarm_yn
,	cte.remark
,	cte.raw_type
,	cte.table_name
,	cte.column_name
,	cte.create_user
,	getdate()
,	cte.judge_yn
from 
	cte
;

with cte as 
(
	select 
		a.*
	from dbo.tb_recipe_model a 
	where 
		a.corp_id		= @corp_id
	and a.fac_id		= @fac_id
	and a.model_code	= @model_code
	and a.approve_key = '' 
)
insert into
	dbo.tb_recipe_model
(
	corp_id
,	fac_id
,	approve_key
,	model_code
,	operation_seq_no
,	operation_code
,	workcenter_code
,	group_code
,	eqp_code
,	interlock_yn
,	remark
,	create_user
,	create_dt
)
select 
	cte.corp_id
,	cte.fac_id
,	@approve_key
,	cte.model_code
,	cte.operation_seq_no
,	cte.operation_code
,	cte.workcenter_code
,	cte.group_code
,	cte.eqp_code
,	cte.interlock_yn
,	cte.remark
,	cte.create_user
,	getdate()
from 
	cte
;