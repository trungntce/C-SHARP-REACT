SELECT 
      [img_path],
      [img_name]
  FROM [dbo].[tb_checksheet_item_img]
  WHERE 
    [guid] = @guid
  ;