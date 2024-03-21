
insert into
    dbo.tb_roll_panel_map
(
  corp_id
, fac_id
, roll_id
, panel_id
, device_id
, workorder
, oper_seq_no
, oper_code
, eqp_code
, scan_dt
, create_dt
)
values
(
  @corp_id
, @fac_id
, @roll_id
, @panel_id
, @device_id
, @workorder
, @oper_seq_no
, @oper_code
, @eqp_code
, GETDATE()
, GETDATE()
);
