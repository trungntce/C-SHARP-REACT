update
	dbo.tb_api_history
set
	response = @response
where
	history_no = @history_no
;

