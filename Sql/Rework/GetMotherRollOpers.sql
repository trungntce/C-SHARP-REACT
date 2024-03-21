SELECT
    oper.OPERATION_SEQ_NO AS oper_seq,
    sso.OPERATION_CODE AS oper_code,
    sso.OPERATION_DESCRIPTION AS oper_name
FROM
    dbo.erp_wip_operations oper
JOIN
    dbo.erp_sdm_standard_operation sso ON oper.OPERATION_ID = sso.OPERATION_ID
WHERE
    oper.JOB_NO = (
        SELECT TOP 1
            workorder
        FROM
            dbo.tb_roll_map
        WHERE
            parent_id = @roll_id
    )
ORDER BY
    oper.OPERATION_SEQ_NO;