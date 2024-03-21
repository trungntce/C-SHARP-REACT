select
	cks.checksheet_group_code
,	cksgrp.checksheet_group_name
,	cks.checksheet_code
,	cksgrp.workcenter_code
,	work.WORKCENTER_DESCRIPTION workcenter_description
,	cks.use_yn
,	cks.remark
,	cks.rev
,	cks.parent_id
,	cks.create_user
,	cks.valid_strt_dt
,	cks.valid_end_dt
,	cks.create_dt
from
	dbo.tb_checksheet as cks

LEFT JOIN dbo.tb_checksheet_group as cksgrp
	ON cks.checksheet_group_code = cksgrp.checksheet_group_code
LEFT JOIN dbo.erp_sdm_standard_workcenter as work
	ON cksgrp.workcenter_code = work.WORKCENTER_CODE

where 
	cks.corp_id			= @corp_id
and	cks.fac_id			= @fac_id
and cks.use_yn			= @use_yn
and cksgrp.group_type	= @group_type
and cksgrp.workcenter_code = @workcenter_code
and	cks.checksheet_group_code = @checksheet_group_code
and cks.checksheet_code in (select itm.checksheet_code from tb_checksheet_item itm where itm.eqp_code = @eqp_code)

order by
	cks.create_dt desc
;