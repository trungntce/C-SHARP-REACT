select
    *
from
    dbo.tb_panel_interlock
where
    roll_id = @roll_id AND off_dt IS NULL;