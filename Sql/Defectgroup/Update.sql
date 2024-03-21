update 
	dbo.tb_defectgroup
set 
	defectgroup_name	= @defectgroup_name
,	use_yn				= @use_yn
,	sort				= @sort
,	remark				= @remark
,	update_user			= @update_user
,	update_dt			= getdate()
where 
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	defectgroup_code	= @defectgroup_code
;
