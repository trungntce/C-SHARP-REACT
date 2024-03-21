--파리미터 
IF EXISTS (
    select 
       * 
    from 
       tb_param_workorder
    where 
          workorder = @workorder
      and operation_seq_no = @oper_seq_no
      and operation_code = @oper_code
      and eqp_code = @eqp_code
)
begin
   select 
      param_id,
      unit,
      std,
      lcl,
      ucl,
      lsl,
      usl,
      table_name ,
      column_name 
   from 
        tb_param_workorder
   where
        workorder = @workorder
     and operation_seq_no = @oper_seq_no
     and operation_code = @oper_code
     and eqp_code = @eqp_code
end
else
begin 
   select
      a.model_code,
      a.operation_code,
	  a.eqp_code,
      b.group_code,
      b.group_name,
      b.unit,
      b.std,
      b.lcl,
      b.ucl,
      b.lsl,
      b.usl,
      b.table_name,
      b.column_name,
      b.param_id,
      b.param_name
   from
      tb_param_model a
   join tb_param b
     on b.corp_id = a.corp_id 
    and b.fac_id = a.fac_id
    and b.group_code = a.group_code
    and b.eqp_code = a.eqp_code 
    and b.group_code = a.group_code
    and b.judge_yn = 'Y' --판정여부
    where
        a.model_code = @model_code
     and a.operation_seq_no = @oper_seq_no
     and a.operation_code = @oper_code
     and a.eqp_code = @eqp_code
end