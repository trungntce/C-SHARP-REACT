-- <root>
--   <item>
--     <menuId>L0005</menuId>
--   </item>
--   <item>
--     <menuId>L0006</menuId>
--   </item>
-- </root>

WITH CTE AS
(
	SELECT
	t.c.value('menuId[1]', 'NVARCHAR(50)')	AS MENU_ID
FROM
	@XMLDOC.nodes('/root/item') t(c)
)
DELETE
	dbo.TB_MENU
FROM
	dbo.TB_MENU A
JOIN
	CTE
	ON A.MENU_ID = CTE.MENU_ID
;
