insert into
    dbo.tb_panel_defect 
(
    corp_id
,   fac_id
,   roll_id
,   panel_id
,   auto_yn
,   on_remark
,   defect_code
,   on_update_user
,   on_dt
)
select 
    @corp_id
,   @fac_id
,   (select roll_id from dbo.tb_roll_panel_map where panel_id = @panel_id) as roll_id
,   @panel_id
,   @auto_yn
,   @on_remark
,   @defect_code
,   @create_user
,   GETDATE()
;