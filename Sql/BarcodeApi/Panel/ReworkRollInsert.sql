insert into
    dbo.tb_panel_rework (
        corp_id
    ,   fac_id
    ,   oper_code
    ,   roll_id
    ,   panel_id
    ,   put_remark
    ,   rework_code
    ,   put_update_user
    ,   put_dt
    )
select 
    @corp_id
,   @fac_id
,   @oper_code
,   @roll_id
,   map.panel_id
,   @put_remark
,   @rework_code
,   @put_update_user
,   GETDATE()
from
    dbo.tb_roll_panel_map map
where
    map.roll_id = @roll_id;