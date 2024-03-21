insert into
    dbo.tb_panel_defect
    (
        corp_id
    ,   fac_id
    ,   roll_id
    ,   panel_id
    ,   defect_code
    ,   auto_yn
    ,   on_remark
    ,   on_update_user
    ,   on_dt
    )
select distinct
    @corp_id
,   @fac_id
,   @roll_id
,   map.panel_id
,   @defect_code
,   @auto_yn
,   @on_remark
,   @on_update_user
,   GETDATE()
from
    dbo.tb_roll_panel_map map
where
    map.roll_id = @roll_id
;