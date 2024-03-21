insert into
    dbo.tb_roll_rework (
        corp_id
    ,   fac_id
    ,   rework_approve_yn
    ,   oper_seq
    ,   oper_code
    ,   oper_name
    ,   parent_roll_id
    ,   roll_id
    ,   put_remark
    ,   rework_code
    ,   put_update_user
    ,   put_dt
    )
select 
    @corp_id
,   @fac_id
,   @rework_approve_yn
,   @oper_seq
,   @oper_code
,   @oper_name
,   @parent_roll_id
,   map.child_id
,   @put_remark
,   @rework_code
,   @put_update_user
,   GETDATE()
from
    dbo.tb_roll_map map
where
    map.parent_id = @parent_roll_id;