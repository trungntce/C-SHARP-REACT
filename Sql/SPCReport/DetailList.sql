select 
	*
from
(
	select * from dbo.fn_spc_ipqc_renewal2(null, null, null, null, @item_code, @model_code, @oper_code, @inspect_desc, @workorder, @oper_seq_no, null) 
	union  all 
	select * from dbo.fn_spc_cmi_renewal2(null, null, null, null, @item_code, @model_code, @oper_code, @inspect_desc, @workorder, @oper_seq_no, null)
	union all 
	select * from dbo.fn_spc_trust_renewal2(null, null,  null, null, @item_code, @model_code, @oper_code, @inspect_desc, @workorder, @oper_seq_no, null)
) a
where 
	1=1
	and a.usl = @usl 
	and a.lsl = @lsl
;