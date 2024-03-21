select
	work.WORKCENTER_CODE workcenter_code
,	work.WORKCENTER_DESCRIPTION workcenter_description
,	cksgrp.checksheet_group_code
,	cksgrp.checksheet_group_name
,	cksgrp.group_type
,	cksgrp.use_yn
,	cksgrp.remark
,	cksgrp.create_user
,	cksgrp.create_dt
from
	dbo.tb_checksheet_group as cksgrp

LEFT JOIN dbo.erp_sdm_standard_workcenter as work
	ON cksgrp.workcenter_code = work.WORKCENTER_CODE

where 
	corp_id			= @corp_id
and	fac_id			= @fac_id
and group_type = 'CLEAN'
and use_yn			= @use_yn
and cksgrp.workcenter_code			= @workcenter_code
and	cksgrp.checksheet_group_code = @checksheet_group_code
and	cksgrp.checksheet_group_name like '%' + @checksheet_group_name + '%'

order by
	cksgrp.create_dt desc
;