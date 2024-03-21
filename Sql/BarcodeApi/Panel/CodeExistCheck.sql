SELECT
	count(*) as cnt
FROM
	MES.dbo.tb_code
WHERE 
	codegroup_id = @codegroup_Id AND
	code_id = @code