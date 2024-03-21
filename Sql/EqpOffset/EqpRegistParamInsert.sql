insert into
	dbo.tb_eqp_offset_param_map
(	
	corp_id
,	fac_id
,	map_id
,	ext_id
,	param_id
,	create_user
,	create_dt
)
select 
	@corp_id
,	@fac_id
,	@map_id
,	@ext_id
,	@param_id
,	@create_user
,	getdate()
