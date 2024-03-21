with cte as
(
    select 
        panel_interlock_id
    ,   off_remark
    ,   off_update_user
    from 
        openjson(@json) 
        with 
        (
            panel_interlock_id int '$.PanelInterlockId'
        ,   off_remark NVARCHAR(100) '$.OffRemark'
        ,   off_update_user NVARCHAR(50) '$.OffUpdateUser'
        )
),
max_on_dt_cte as
(
    select 
        panel_interlock_id
    ,   MAX(on_dt) as max_on_dt
    from
        dbo.tb_panel_interlock
    group by
        panel_interlock_id
)
update
    dbo.tb_panel_interlock
set
    off_remark = cte.off_remark
,   off_update_user = cte.off_update_user
,   off_dt = getdate()
from
    dbo.tb_panel_interlock tpi
join
    cte
    on tpi.panel_interlock_id = cte.panel_interlock_id
join
    max_on_dt_cte modt
    on tpi.panel_interlock_id = modt.panel_interlock_id
    and tpi.on_dt = modt.max_on_dt
;