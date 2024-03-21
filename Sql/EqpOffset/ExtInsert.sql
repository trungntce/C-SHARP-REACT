insert into
	dbo.tb_eqp_ext
(	
	corp_id
,	fac_id
,	ext_id
,	eqp_code
,	barcode_yn
,	create_user
,	create_dt
)
select 
	@corp_id
,	@fac_id
,	@ext_id
,	@eqp_code
,	@barcode_yn
,	@create_user
,	getdate()
;