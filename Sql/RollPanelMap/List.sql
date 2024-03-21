select
	  a.corp_id
	, a.fac_id
	, a.roll_id
	, a.panel_id
	, a.device_id
	, a.workorder
	, a.oper_seq_no
	, a.oper_code
	, sso.OPERATION_DESCRIPTION
	, a.eqp_code
	, a.scan_dt
	, a.create_dt
from
	MES.dbo.tb_roll_panel_map a
left outer join 
	erp_sdm_standard_operation sso
	on sso.OPERATION_CODE = a.oper_code
where
	a.corp_id = @corp_id
	and a.fac_id = @fac_id
	and a.create_dt >= @from_dt
	and a.create_dt < @to_dt
	and a.roll_id like '%' + @roll_id + '%'
	and a.panel_id like '%' + @panel_id + '%'
	and a.workorder like '%' + @workorder + '%'
;
