with cte as
(
    select 
        panel_id
    from 
        openjson(@json) 
        with 
        (
            panel_id varchar(40) '$.PanelId'
        )
)
update
	dbo.tb_panel_realtime
set
	interlock_yn = @interlock_yn
,	update_dt = getdate()
from
    dbo.tb_panel_realtime rea
join
    cte
    on rea.panel_id = cte.panel_id

;