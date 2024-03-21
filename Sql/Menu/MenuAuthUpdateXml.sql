DELETE
	dbo.TB_MENU_AUTH
WHERE
	[USER_ID] = @USER_ID
;

WITH CTE AS
(
    SELECT
		t.c.value('local-name(.)', 'NVARCHAR(50)')	AS MENU_ID
	,	t.c.value('.', 'INT')						AS AUTH
    FROM
        @AUTHXML.nodes('/root/item/*') t(c)
)
INSERT INTO
    dbo.TB_MENU_AUTH
SELECT
    @USER_ID
,   cte.MENU_ID
,   cte.AUTH
,	@CREATE_USER_ID
,	GETDATE()
,	NULL
,	NULL
FROM
    CTE
;