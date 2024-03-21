select
	eqpareagroup_code
,	eqparea_code
,	eqparea_name
,	use_yn
,	sort
,	remark
,	create_dt
,	create_user
,	update_dt
,	update_user
from 
	dbo.tb_eqparea
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	eqpareagroup_code	= @eqpareagroup_code
and	eqparea_code		= @eqparea_code
and	eqparea_name		like '%' + @eqparea_name + '%'
and use_yn				= @use_yn
and remark				like '%' + @remark + '%'
order by
	sort
;