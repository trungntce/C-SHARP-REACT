insert into
    dbo.tb_roll_hold (
         corp_id
    ,    fac_id
    ,    row_key
    ,    roll_id
    ,    on_remark
    ,    hold_code
    ,    on_update_user
    ,    on_dt
    )
select 
    'SIFLEX',
    'SIFLEX',
    pi.row_key,
    @roll_id,
    @on_remark,
    @hold_code,
    @on_update_user,
    GETDATE()
from
    dbo.tb_roll_realtime pi
where
    pi.roll_id = @roll_id;