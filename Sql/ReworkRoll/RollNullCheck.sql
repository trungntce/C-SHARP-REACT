select
    *
from
    dbo.tb_roll_rework
where
    roll_id = @roll_id AND approve_dt IS NULL;