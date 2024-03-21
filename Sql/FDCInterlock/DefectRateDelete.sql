delete from
	dbo.tb_fdc_defect_rate
where
	corp_id = @corp_id
and	fac_id = @fac_id
and	model_code = @model_code
;