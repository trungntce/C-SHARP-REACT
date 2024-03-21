insert into
    dbo.tb_panel_rework 
(
    corp_id
,   fac_id
,   oper_seq
,   oper_code
,   oper_name
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
,   @oper_seq
,   @oper_code
,   @oper_name
,   (select roll_id from dbo.tb_roll_panel_map where panel_id = @panel_id) as roll_id
,   @panel_id
,   @put_remark
,   @rework_code
,   @put_update_user
,   GETDATE()
;