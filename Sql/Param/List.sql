select
	a.eqp_code
,	c.EQUIPMENT_DESCRIPTION as eqp_name
,	a.param_id
,	a.group_code
,	grp.group_name
,	a.gubun1
,	a.gubun2
,	a.param_name
,	a.param_short_name
,	a.cate_name
,	a.unit
,	a.std
,	a.lcl
,	a.ucl
,	a.lsl
,	a.usl
,	a.remark
,	a.interlock_yn
,	a.alarm_yn
,	a.raw_type
,	a.table_name
,	case when a.table_name is null or a.table_name = '' then ''
	else c.EQP_GROUP_DESCRIPTION  end as roomname
,	a.column_name
,	isnull(b.symbolcomment, d.columncomment) as symbolcomment
,	b.pvsv
,	a.create_user
,	a.create_dt
,	a.start_time
,	a.end_time
,	a.judge_yn
from
	dbo.tb_param a
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
and a.param_id			like '%' + @param_id	+ '%'
and a.group_code		= @group_code
and a.approve_key		= ''
order by a.group_code, a.param_id desc
;
