delete from
	dbo.tb_oper_capa
where
	corp_id = @corp_id
	and fac_id = @fac_id
	and row_no = @row_no
;
