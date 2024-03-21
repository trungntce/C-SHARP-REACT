select
    *
from
    dbo.tb_panel_defect
where
    panel_id = @panel_id AND off_dt IS NULL;