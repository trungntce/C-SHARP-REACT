insert into  
	dbo.tb_panel_4m_cancel 
( 
    corp_id
,   fac_id
,   row_key
,   group_key
,   body_json
,   wokrer_code
,   cancel_code
,   cancel_remark
,   cancel_dt
,   scan_dt
,   create_dt
)
values
(
    @corp_id
,   @fac_id
,   @row_key
,   @group_key
,   @body_json
,   @wokrer_code
,   @cancel_code
,   @cancel_remark
,	getdate()
,	getdate()
,	getdate()
)