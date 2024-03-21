insert into
   dbo.tb_roll_map_cancel
(
    corp_id
,   fac_id
,   group_key
,   parent_id
,   child_id
,   from_panel_id
,   to_panel_id
,   panel_cnt
,   defect_code
,   device_id
,   workorder
,   oper_seq_no
,   oper_code
,   eqp_code
,   worker_code
,   reason
,   cancel_dt
,   scan_dt
,   create_dt
    )
values(
    @corp_id
,   @fac_id
,   @group_key
,   @parent_id
,   @child_id
,   @from_panel_id
,   @to_panel_id
,   @panel_cnt
,   @defect_code
,   @device_id
,   @workorder
,   @oper_seq_no
,   @oper_code
,   @eqp_code
,   @worker_code
,   @reason
,   getdate()
,   @scan_dt
,   @create_dt
);