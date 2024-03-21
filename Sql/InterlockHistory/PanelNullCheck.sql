select
    *
from
    dbo.tb_panel_interlock
where
    panel_id = @panel_id AND off_dt IS NULL;