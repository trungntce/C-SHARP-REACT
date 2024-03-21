insert into
    dbo.tb_panel_4m_recipe_error
(
	corp_id
, 	fac_id
, 	eqp_code
, 	recipe_code
, 	workorder
, 	oper_seq_no
, 	base_val
, 	eqp_val
, 	judge
, 	raw_type
, 	table_name
, 	column_name
, 	create_dt
)
values
(
	@corp_id
, 	@fac_id
, 	@eqp_code
, 	@recipe_code
, 	@workorder
, 	@oper_seq_no
, 	@base_val
, 	@eqp_val
, 	@judge
, 	@raw_type
, 	@table_name
, 	@column_name
, getdate()
)