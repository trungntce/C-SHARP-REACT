update
	dbo.tb_emapping_layout
set
	pcs_per_h	= @pcs_per_h
,	pcs_per_v	= @pcs_per_v
,	pcs_json	= @pcs_json
,	remark		= @remark
,	update_user	= @update_user
,	update_dt	= getdate()
where
	corp_id		= @corp_id
and	fac_id		= @fac_id
and	model_code	= @model_code
;