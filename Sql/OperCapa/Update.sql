update
	dbo.tb_oper_capa
set
	 oper_group_name = @oper_group_name
	, in_capa_val = @in_capa_val
	, unit = @unit
	, gubun = @gubun
	, update_user = @update_user
	, update_dt = getDate()
where
	corp_id = @corp_id
	and fac_id = @fac_id
	and row_no = @row_no
;