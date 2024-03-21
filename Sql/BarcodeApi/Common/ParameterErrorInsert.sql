insert into 
    dbo.tb_panel_4m_param_error
(
    corp_id
,   fac_id
,   eqp_code
,   param_id
,   workorder
,   oper_seq_no
,   std
,   lcl
,   ucl
,   lsl
,   usl
,   eqp_val
,   judge
,   raw_type
,   table_name
,   column_name
,   create_dt
)
values
(
    @corp_id
,   @fac_id
,   @eqp_code
,   @param_id
,   @workorder
,   @oper_seq_no
,   @std
,   @lcl
,   @ucl
,   @lsl
,   @usl
,   @eqp_val
,   @judge
,   @raw_type
,   @table_name
,   @column_name
,   getdate()
)
