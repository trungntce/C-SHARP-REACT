﻿SELECT
	MENU_ID
,	AUTH
FROM
	dbo.TB_MENU_AUTH 
WHERE
	USER_ID = @USER_ID
;