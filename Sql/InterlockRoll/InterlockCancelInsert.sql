update
    pi
set
    off_remark = @off_remark,
    off_update_user = @off_update_user,
    off_dt = GETDATE()
from
    dbo.tb_panel_interlock pi
inner join (
    select
        panel_id
    from
        tb_roll_panel_map
    where
        roll_id = @roll_id
) rp on pi.panel_id = rp.panel_id
where
    pi.on_dt = (
    select
        MAX(on_dt)
    from
        dbo.tb_panel_interlock
    where
        panel_id = pi.panel_id
);