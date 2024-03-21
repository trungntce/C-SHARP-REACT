--MADE BY SIFLEX
INSERT 
INTO [dbo].[tb_recipe_model] ( 
  [corp_id]
  , [fac_id]
  , [approve_key]
  , [model_code]
  , [operation_seq_no]
  , [operation_code]
  , [workcenter_code]
  , [group_code]
  , [eqp_code]
  , [interlock_yn]
  , [remark]
  , [create_user]
  , [create_dt]
) 
SELECT   [corp_id]
  , [fac_id]
  , [approve_key]
  , @to_model_code 
  , [operation_seq_no]
  , [operation_code]
  , [workcenter_code]
  , [group_code]
  , [eqp_code]
  , 'N'
  , [remark]
  , [create_user]
  , [create_dt]
FROM [dbo].[tb_recipe_model]
	WHERE model_code = @from_model_code
		AND operation_seq_no = @operation_seq_no
		AND eqp_code = @eqp_code
		AND corp_id = @corp_id
		AND fac_id = @fac_id
		AND 0 = (SELECT COUNT(1) FROM [dbo].[tb_recipe_model] 
					WHERE model_code = @to_model_code 
						AND operation_seq_no = @operation_seq_no 
						AND eqp_code = @eqp_code
						AND corp_id = @corp_id
						AND fac_id = @fac_id)
;

INSERT 
INTO [dbo].[tb_param_model] ( 
  [corp_id]
  , [fac_id]
  , [approve_key]
  , [model_code]
  , [operation_seq_no]
  , [operation_code]
  , [workcenter_code]
  , [eqp_code]
  , [group_code]
  , [interlock_yn]
  , [remark]
  , [create_user]
  , [create_dt]
) 
SELECT   [corp_id]
  , [fac_id]
  , [approve_key]
  , @to_model_code
  , [operation_seq_no]
  , [operation_code]
  , [workcenter_code]
  , [eqp_code]
  , [group_code]
  , [interlock_yn]
  , [remark]
  , [create_user]
  , [create_dt]
FROM [dbo].[tb_param_model]
WHERE corp_id = @corp_id
	AND fac_id = @fac_id
	AND model_code = @from_model_code
	AND operation_seq_no = @operation_seq_no
	AND eqp_code = @eqp_code
	AND 0 = (SELECT COUNT(1) 
				FROM [dbo].[tb_param_model] 
				WHERE corp_id = @corp_id
					AND fac_id = @fac_id
					AND model_code = @to_model_code
					AND operation_seq_no = @operation_seq_no
					AND eqp_code = eqp_code)
;