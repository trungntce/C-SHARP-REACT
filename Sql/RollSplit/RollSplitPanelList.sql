select
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
from
	dbo.tb_roll_panel_map
where
	corp_id 	= @corp_id
and fac_id 		= @fac_id
and workorder	= @workorder
and eqp_code	= @eqp_code
and roll_id		= @child_id
;