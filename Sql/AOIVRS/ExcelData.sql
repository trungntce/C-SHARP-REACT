with cte as 
(
	select
		item.*
	from
		openjson(@json)
		with
		(
			mesdate 	 	datetime '$.mesdate'
		,	vendor_name		varchar(40) '$.vendor_name'
		,	item_code		varchar(40) '$.item_code'
		,	item_name 	 	varchar(40) '$.item_name'
		,	eqp_code		varchar(40) '$.eqp_code'
		,	eqp_name		varchar(40) '$.eqp_name'
		,	model_code		varchar(40) '$.model_code'
		,	app_code		varchar(40) '$.app_code'
		,	app_name		varchar(40) '$.app_name'
		,	workorder 	 	varchar(40) '$.workorder'
		,	panel_cnt		float '$.panel_cnt'
		,	defect_pnl		float '$.defect_pnl'
		,	ngcnt			float '$.ngcnt'
		,	[none]			float '$.none'
		,	short_df		float '$.short_df'
		,	short_et 	 	float '$.short_et'
		,	short_md		float '$.short_md'
		,	short_df_repair	float '$.short_df_repair'
		,	short_et_repair	float '$.short_et_repair'
		,	short_md6		float '$.short_md6'
		,	open_df 	 	float '$.open_df'
		,	open_et			float '$.open_et'
		,	open_madong		float '$.open_madong'
		,	slit_df			float '$.slit_df'
		,	slit_et			float '$.slit_et'
		,	slit_madong 	float '$.slit_madong'
		,	open_qc			float '$.open_qc'
		,	dong_cuc4		float '$.dong_cuc4'
		,	dong_cuc5		float '$.dong_cuc5'
		,	pine_hole		float '$.pine_hole'
		,	lech_hole_df 	float '$.lech_hole_df'
		,	lech_hole_cnc	float '$.lech_hole_cnc'
		,	chua_mon		float '$.chua_mon'
		, 	tran_dong0 	 	float '$.tran_dong0'
		,	tran_dong1		float '$.tran_dong1'
		,	tac_hole		float '$.tac_hole'
		,	tenting 	 	float '$.tenting'
		,	pjt				float '$.pjt'
		,	khac			float '$.khac'
		,	short_df_aor	float '$.short_df_aor'
		,	short_et_aor	float '$.short_et_aor'
		,	short_md_aor 	float '$.short_md_aor'
		,	dc_aor			float '$.dc_aor'
		,	aor				float '$.aor'
		,	miss_feature	float '$.miss_feature'
		,	skip_pcb		float '$.skip_pcb'
		,	short_point		float '$.short_point'
		,	pcs_total 	 	float '$.pcs_total'
		,	ng_pcs_total	float '$.ng_pcs_total'
		,	ng_rate			float '$.ng_rate'
	) item
)
select 
	cte.*
	,	isnull(panel_cnt *100 / nullif( cte.ngcnt,0),0) as defect_pnl
	,	isnull([none] *100 / nullif( cte.ngcnt,0),0) as none_rate			
	,	isnull(short_df * 100 / nullif(ngcnt,0),0) as short_df_rate		
	,	isnull(short_et * 100 / nullif(ngcnt,0),0) as short_et_rate 	 	
	,	isnull(short_md * 100 / nullif(ngcnt,0),0) as short_md_rate		
	,	isnull(short_df_repair * 100 / nullif(ngcnt,0),0) as short_df_repair_rate	
	,	isnull(short_et_repair * 100 / nullif(ngcnt,0),0) as short_et_repair_rate	
	,	isnull(short_md6 * 100 / nullif(ngcnt,0),0) as short_md6_rate		
	,	isnull(open_df * 100 / nullif(ngcnt,0),0) as open_df_rate 	
	,	isnull(open_et * 100 / nullif(ngcnt,0),0) as open_et_rate		
	,	isnull(open_madong * 100 / nullif(ngcnt,0),0) as open_madong_rate		
	,	isnull(slit_df * 100 / nullif(ngcnt,0),0) as slit_df_rate			
	,	isnull(slit_et * 100 / nullif(ngcnt,0),0) as slit_et_rate			
	,	isnull(slit_madong * 100 / nullif(ngcnt,0),0) as slit_madong_rate 	
	,	isnull(open_qc * 100 / nullif(ngcnt,0),0) as open_qc_rate			
	,	isnull(dong_cuc4 * 100 / nullif(ngcnt,0),0) as dong_cuc4_rate		
	,	isnull(dong_cuc5 * 100 / nullif(ngcnt,0),0) as dong_cuc5_rate		
	,	isnull(pine_hole * 100 / nullif(ngcnt,0),0) as pine_hole_rate		
	,	isnull(lech_hole_df * 100 / nullif(ngcnt,0),0) as lech_hole_df_rate 	
	,	isnull(lech_hole_cnc * 100 / nullif(ngcnt,0),0) as lech_hole_cnc_rate	
	,	isnull(chua_mon * 100 / nullif(ngcnt,0),0) chua_mon_rate		
	,	isnull(tran_dong0 * 100 / nullif(ngcnt,0),0) tran_dong0_rate 	 	
	,	isnull(tran_dong1 * 100 / nullif(ngcnt,0),0) as tran_dong1_rate		
	,	isnull(tac_hole * 100 / nullif(ngcnt,0),0) as tac_hole_rate		
	,	isnull(tenting * 100 / nullif(ngcnt,0),0) as tenting_rate 	 	
	,	isnull(pjt * 100 / nullif(ngcnt,0),0) as pjt_rate			
	,	isnull(khac * 100 / nullif(ngcnt,0),0) as khac_rate			
	,	isnull(short_df_aor * 100 / nullif(ngcnt,0),0) as short_df_aor_rate	
	,	isnull(short_et_aor * 100 / nullif(ngcnt,0),0) as short_et_aor_rate	
	,	isnull(short_md_aor * 100 / nullif(ngcnt,0),0) as short_md_aor_rate 	
	,	isnull(dc_aor * 100/ nullif(ngcnt,0),0) as dc_aor_rate			
	,	isnull(aor * 100 / nullif(ngcnt,0),0) as aor_rate				
	,	isnull(miss_feature * 100 / nullif(ngcnt,0),0) as miss_feature_rate	
	,	isnull(skip_pcb * 100 / nullif(ngcnt,0),0) as skip_pcb_rate		
	,	isnull(short_point * 100 / nullif(ngcnt,0),0) as short_point_rate	
	,	isnull(pcs_total * 100 / nullif(ngcnt,0),0) as pcs_total_rate 	 	
	,	isnull(ng_pcs_total * 100 / nullif(ngcnt,0),0) as ng_pcs_total_rate	
	,	isnull(ng_rate * 100 / nullif(ngcnt,0),0) as ng_rate_rate		
from 
	cte


