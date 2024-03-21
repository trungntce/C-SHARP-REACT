insert into
	dbo.tb_eqp_offset
(	corp_id,
	fac_id,
	ext_id,
	eqp_code,
	eqpareagroup_seq,
	eqpareagroup_code,
	eqparea_seq,
	eqparea_code,
	ext_mm,
	create_user,
	create_dt
)
select 
	@corp_id
,	@fac_id
,	@ext_id
,	@eqp_code
,	@eqpareagroup_seq
,	@eqpareagroup_code
,	@eqparea_seq
,	@eqparea_code
,	round(convert(float, @ext_mm),1)
,	@create_user
,	getdate()
;