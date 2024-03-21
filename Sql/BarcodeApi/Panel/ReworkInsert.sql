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
,   rpm.roll_id
,   @panel_id
,   @put_remark
,   @rework_code
,   @put_update_user
,   GETDATE()
from
    dbo.tb_roll_panel_map rpm
where
    rpm.panel_id = @panel_id;