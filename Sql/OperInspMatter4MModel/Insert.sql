with cte as
(
	select distinct
		@corp_id			as corp_id
	,	@fac_id				as fac_id
	,	model_code 			as model_code
	,	oper_seq_no 		as oper_seq_no
	,	oper_code 			as oper_code
	,	material_yn 		as material_yn
	,	tool_yn 			as tool_yn
	,	worker_yn 			as worker_yn
	,	sampling_yn 		as sampling_yn
	,	total_insp_yn 		as total_insp_yn
	,	spc_yn 				as spc_yn
	,	qtime_yn 			as qtime_yn
	,	chem_yn 			as chem_yn
	,	recipe_yn 			as recipe_yn
	,	param_yn 			as param_yn
	,	panel_yn 			as panel_yn
	,	@create_user		as create_user
	,	getdate()			as create_dt
	from 
		openjson(@model_list)
		with 
			(
				model_code varchar(100) '$.modelCode'
			,	oper_seq_no int '$.operSeqNo'
			,	oper_code varchar(100) '$.operCode'
			,	material_yn varchar(100) '$.materialYn'
			,	tool_yn varchar(1) '$.toolYn'
			,	worker_yn varchar(1) '$.workerYn'
			,	sampling_yn varchar(1) '$.samplingYn'
			,	total_insp_yn varchar(1) '$.totalInspYn'
			,	spc_yn varchar(1) '$.spcYn'
			,	qtime_yn varchar(1) '$.qtimeYn'
			,	chem_yn varchar(1) '$.chemYn'
			,	recipe_yn varchar(1) '$.recipeYn'
			,	param_yn varchar(1) '$.paramYn'
			,	panel_yn varchar(1) '$.panelYn'
			)
)
INSERT INTO
	MES.dbo.tb_oper_insp_matter_4m_model
(
	corp_id,
	fac_id,
	model_code,
	oper_seq_no,
	oper_code,
	material_yn,
	tool_yn,
	worker_yn,
	sampling_yn,
	total_insp_yn,
	spc_yn,
	qtime_yn,
	chem_yn,
	recipe_yn,
	param_yn,
	panel_yn,
	create_user,
	create_dt
)
select
	corp_id
,	fac_id
,	model_code
,	oper_seq_no
,	oper_code
,	material_yn
,	tool_yn
,	worker_yn
,	sampling_yn
,	total_insp_yn
,	spc_yn
,	qtime_yn
,	chem_yn
,	recipe_yn
,	param_yn
,	panel_yn
,	create_user
,	create_dt
from
	cte
;