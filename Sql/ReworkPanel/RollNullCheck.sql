select
    *
from
    dbo.tb_panel_rework
where
    roll_id = @roll_id AND approve_dt IS NULL;