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
	corp_id = @corp_id
	and fac_id = @fac_id
	and defect_code = @defect_code
;