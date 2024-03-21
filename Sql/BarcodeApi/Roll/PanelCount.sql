SELECT COUNT(*)
  FROM dbo.tb_roll_panel_map
  WHERE panel_id >= @from_panel_id
    AND panel_id <= @to_panel_id