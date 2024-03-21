select
	defectgroup_code
,	defect_code
,	defect_name
,	use_yn
,	sort
,	remark
,	create_user
,	create_dt
from
	dbo.tb_defect
where
	corp_id			 = @corp_id
and	fac_id			 = @fac_id
and	defectgroup_code = @defectgroup_code
and	defect_code		 = @defect_code
and	defect_name		 like '%' + @defect_name + '%'
and use_yn			 = @use_yn
and remark			 like '%' + @remark + '%'
order by
	sort
;