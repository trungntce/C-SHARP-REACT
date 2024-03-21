insert into
    dbo.tb_panel_hold (
         corp_id
    ,    fac_id
    ,    row_key
    ,    panel_id
    ,    on_remark
    ,    hold_code
    ,    on_update_user
    ,    on_dt
    )
select 
     'SIFLEX'
,    'SIFLEX'
,    pi.row_key
,    @panel_id
,    @on_remark
,    @hold_code
,    @on_update_user
,    GETDATE()
from
    dbo.tb_panel_item pi
where
    pi.panel_id = @panel_id;