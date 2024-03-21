SELECT 

	cksg.checksheet_group_code,
	prod.item_code,
	prod.item_name,
    prod.use_yn,
	prod.remark,
	prod.create_user,
	prod.create_dt
FROM dbo.tb_checksheet_group_clean as prod

JOIN dbo.tb_checksheet_group as cksg
	ON prod.checksheet_group_code = cksg.checksheet_group_code
    

WHERE prod.checksheet_group_code = @checksheet_group_code
	and cksg.group_type = 'CLEAN'
order by
	prod.create_dt desc
;