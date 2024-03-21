select
    *
from
    dbo.tb_panel_defect
where
    roll_id = @roll_id AND off_dt IS NULL;