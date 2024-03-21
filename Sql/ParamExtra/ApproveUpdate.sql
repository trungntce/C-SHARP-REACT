update
	dbo.tb_param_model_extra_approve
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
	from dbo.tb_param_extra a  
	join dbo.tb_param_model_extra b on b.eqp_code = a.eqp_code and b.group_code = a.group_code and a.approve_key = '' 
	where 
		a.corp_id		= @corp_id
	and a.fac_id		= @fac_id
	and b.model_code	= @model_code
	and b.approve_key 	= ''
)
insert into
	dbo.tb_param_extra
(
	corp_id
,	fac_id
,	approve_key
,	eqp_code
,	param_id
,	group_code
,	group_name
,	gubun1
,	gubun2
,	param_name
,	param_short_name
,	cate_name
,	unit
,	std
,	lcl
,	ucl
,	lsl
,	usl
,	remark
,	interlock_yn
,	alarm_yn
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
,	cte.param_id
,	cte.group_code
,	cte.group_name
,	'I'
,	' '
,	cte.param_name
,	cte.param_short_name
,	cte.cate_name
,	cte.unit
,	round(convert(float, cte.std),3)
,	round(convert(float, cte.lcl),3)
,	round(convert(float, cte.ucl),3)
,	round(convert(float, cte.lsl),3)
,	round(convert(float, cte.usl),3)
,	cte.remark
,	cte.interlock_yn
,	cte.alarm_yn
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
	from dbo.tb_param_model_extra a 
	where 
		a.corp_id		= @corp_id
	and a.fac_id		= @fac_id
	and a.model_code	= @model_code
	and a.approve_key = '' 
)
insert into
	dbo.tb_param_model_extra
(
	corp_id
,	fac_id
,	approve_key
,	model_code
,	operation_seq_no
,	operation_code
,	workcenter_code
,	eqp_code
,	group_code
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
,	cte.eqp_code
,	cte.group_code
,	cte.interlock_yn
,	cte.remark
,	cte.create_user
,	getdate()
from 
	cte
;