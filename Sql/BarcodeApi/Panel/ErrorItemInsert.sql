insert into
   dbo.tb_panel_error
(
    corp_id
,   fac_id
,   panel_error_id
,   panel_row_key
,   panel_group_key
,   device_id
,   eqp_code
,	img_path
,   scan_dt
,   create_dt
)
select
    @corp_id
,   @fac_id
,   @panel_error_id
,   @panel_row_key
,   @panel_group_key
,   @device_id
,   @eqp_code
,	@img_path
,   @scan_dt
,   getdate()