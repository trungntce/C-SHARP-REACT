insert into
	dbo.tb_oper_capa
(	
  corp_id
, fac_id
, oper_seq_no
, oper_group_code
, oper_group_name
, in_capa_val
, unit
, gubun
, create_user
, create_dt

)
values(
  @corp_id
, @fac_id
, (select Top 1 oper_seq_no + 10 from dbo.tb_oper_capa order by oper_seq_no desc)
, @oper_group_code
, @oper_group_name
, @in_capa_val
, @unit
, @gubun
, @create_user
, getDate()
);
