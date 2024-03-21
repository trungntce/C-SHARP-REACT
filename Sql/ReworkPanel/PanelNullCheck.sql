select
    *
from
    dbo.tb_panel_rework
where
    panel_id = @panel_id AND approve_dt IS NULL;