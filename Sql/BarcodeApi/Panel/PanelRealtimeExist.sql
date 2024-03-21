SELECT 
	* 
FROM
	tb_panel_realtime
WHERE
	panel_id = @panel_id and workorder = @workorder; 
	