SELECT 

ckip.checksheet_code,
ckip.item_code,
ckip.item_name,
ckip.use_yn,
ckip.remark,
ckip.create_user,
ckip.create_dt

FROM dbo.tb_checksheet_item_clean as ckip
JOIN dbo.tb_checksheet cks on ckip.checksheet_code = cks.checksheet_code
JOIN dbo.tb_checksheet_group as cksg
	ON cks.checksheet_group_code = cksg.checksheet_group_code 
WHERE
	cksg.group_type = 'CLEAN'
	AND ckip.checksheet_code = @checksheet_code
order by
	ckip.create_dt desc
;