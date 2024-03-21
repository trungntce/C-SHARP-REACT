IF EXISTS (
  select
        * 
  from 
        tb_recipe_workorder
  where
         workorder = @workorder
    and operation_seq_no = @oper_seq_no 
    and operation_code = @oper_code 
    and eqp_code = @eqp_code 
)
begin
   select 
      recipe_code,
      category_code,
      base_val,
      table_name,
      column_name 
   from 
        tb_recipe_workorder
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
      a.operation_seq_no,
      a.operation_code,
      a.eqp_code,
      b.recipe_code,
      b.base_val,
      b.table_name,
      b.group_code,
      b.recipe_name,
      b.column_name
   from
      tb_recipe_model a
   join tb_recipe b
     on b.corp_id = a.corp_id 
    and b.fac_id = a.fac_id 
    and b.group_code = a.group_code
    and b.eqp_code = a.eqp_code 
    and b.group_code = a.group_code
    and b.judge_yn = 'Y'
    where 
        a.model_code = @model_code 
     and a.operation_seq_no = @oper_seq_no 
     and a.operation_code = @oper_code
     and a.eqp_code = @eqp_code 
end