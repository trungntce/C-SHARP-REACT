SELECT 
	* 
FROM
	tb_panel_realtime
WHERE
	workorder = @workorder and
	panel_id = @panel_id;
	