update
	dbo.tb_roll_4m
set
	start_dt = getdate()
where
	row_key = @row_key
;