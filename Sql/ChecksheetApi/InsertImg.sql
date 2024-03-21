INSERT INTO tb_checksheet_item_img(
	[guid]
	, checksheet_code
	, checksheet_item_code
	, img_name
	, img_path
	, create_user
	, create_dt
) VALUES (
	 @guid
	, @checksheet_code
	, @checksheet_item_code
	, @img_name
	, @img_path
	, @create_user
	, getdate()
);