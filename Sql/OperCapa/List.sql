select
	corp_id
	, fac_id
	, row_no
	, oper_seq_no
	, (select Top 1 oper_seq_no + 10 from dbo.tb_oper_capa order by oper_seq_no desc) as max_oper_seq
	, oper_group_code
	, oper_group_name
	, in_capa_val
	, unit
	, gubun
	, create_user
	, create_dt
	, update_user
	, update_dt
from
	dbo.tb_oper_capa
where
	corp_id = @corp_id
	and fac_id = @fac_id
	and oper_group_name like '%' + @oper_group_name + '%'
order by oper_seq_no
;