SELECT [guid]
      ,[checksheet_code]
      ,[checksheet_item_code]
      ,[img_name]
      ,[img_path]
      ,[create_user]
      ,[create_dt]
  FROM [dbo].[tb_checksheet_item_img]
  WHERE 
    [checksheet_code] = @checksheet_code
    AND [checksheet_item_code] = @item_code
  ;