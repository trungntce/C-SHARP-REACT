with cte as
(
    select 
        panel_interlock_id
    from 
        openjson(@json) 
        with 
        (
            panel_interlock_id int '$.PanelInterlockId'
        )
)
delete p
from
    dbo.tb_panel_interlock p
inner join 
        cte on
        p.panel_interlock_id = cte.panel_interlock_id
;