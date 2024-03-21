select
    *
from
    dbo.tb_roll_rework
where
    parent_roll_id = @parent_roll_id AND approve_dt IS NULL;