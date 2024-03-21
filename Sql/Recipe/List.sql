select
	a.eqp_code
,	c.EQUIPMENT_DESCRIPTION as eqp_name
,	a.recipe_code
,	a.group_code
,	grp.group_name
,	a.recipe_name
,	a.base_val
,	a.val1
,	a.interlock_yn
,	a.alarm_yn
,	a.remark
,	a.raw_type
,	a.table_name
,	case when a.table_name is null or a.table_name = '' then ''
	else c.EQP_GROUP_DESCRIPTION  end as roomname
,	a.column_name
,	isnull(b.symbolcomment, d.columncomment) as symbolcomment
,	b.pvsv
,	a.create_dt
,	a.create_user
,	a.start_time
,	a.end_time
,	a.judge_yn
from
	dbo.tb_recipe a
left join 
	dbo.raw_plcsymbol_infotable b
  on b.eqcode  = a.eqp_code 
 and b.tablename = a.table_name 
 and b.columnname = a.column_name 
left join 
	dbo.raw_pc_infotable d
  on d.equip  = a.eqp_code 
 and d.tablename = a.table_name 
 and d.columnname = a.column_name 
left join 
	dbo.erp_sdm_standard_equipment c
  on c.EQUIPMENT_CODE = a.eqp_code 
left outer join 
	dbo.tb_param_recipe_group grp
  on grp.group_code = a.group_code
where
	a.corp_id			= @corp_id		
and a.fac_id			= @fac_id		
and a.eqp_code			like '%' + @eqp_code	+ '%'
and a.recipe_code		like '%' + @recipe_code	+ '%'
and a.recipe_name		like '%' + @recipe_name + '%'
and a.group_code		= @group_code
and a.approve_key		= ''
order by a.group_code, a.recipe_code desc
;