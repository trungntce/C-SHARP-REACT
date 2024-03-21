if @delete_all = 'Y'
begin
	delete from
		dbo.tb_model_oper_ext
	where 
		corp_id				= @corp_id
	and	fac_id				= @fac_id
	and	model_code			= @model_code
	;	
end
else
begin
	with cte as
	(
		select distinct
			operation_seq_no				as operation_seq_no
		,	operation_code					as operation_code
		from 
			openjson(@json)

			with 
			(
				operation_seq_no	int				'$.OperationSeqNo'
			,	operation_code		varchar(30)		'$.OperationCode'
			)
	)
	delete
		dbo.tb_model_oper_ext
	from
		dbo.tb_model_oper_ext a
	join
		cte
		on	a.operation_seq_no = cte.operation_seq_no
		and	a.operation_code = cte.operation_code
	where 
		corp_id				= @corp_id
	and	fac_id				= @fac_id
	and	model_code			= @model_code
	;	
end
;

with cte as
(
    select distinct
		operation_seq_no				as operation_seq_no
	,	operation_code					as operation_code
	,	isnull(oper_yn, 'N')			as oper_yn	
	,	isnull(scan_eqp_yn, 'N')		as scan_eqp_yn		
	,	isnull(scan_worker_yn, 'N')		as scan_worker_yn	
	,	isnull(scan_material_yn, 'N')	as scan_material_yn
	,	isnull(scan_tool_yn, 'N')		as scan_tool_yn	
	,	isnull(scan_panel_yn, 'N')		as scan_panel_yn	
	,	isnull(scan_type, 'P')			as scan_type	
	,	isnull(start_yn, 'N')			as start_yn		
	,	isnull(end_yn, 'N')				as end_yn			
	,	isnull(rework_yn, 'N')			as rework_yn		
	,	isnull(split_yn, 'N')			as split_yn		
	,	isnull(merge_yn, 'N')			as merge_yn		
	,	remark							as remark
	,	eqp_json						as eqp_json
    from 
        openjson(@json)

	    with 
	    (
			operation_seq_no	int				'$.OperationSeqNo'
		,	operation_code		varchar(30)		'$.OperationCode'
	    ,   oper_yn				char(1)			'$.OperYn'
	    ,   scan_eqp_yn			char(1)			'$.ScanEqpYn'
	    ,   scan_worker_yn		char(1)			'$.ScanWorkerYn'
	    ,   scan_material_yn	char(1)			'$.ScanMaterialYn'
	    ,   scan_tool_yn		char(1)			'$.ScanToolYn'
	    ,   scan_panel_yn		char(1)			'$.ScanPanelYn'
		,   scan_type			char(1)			'$.ScanType'
	    ,   start_yn			char(1)			'$.StartYn'
	    ,   end_yn				char(1)			'$.EndYn'
	    ,   rework_yn			char(1)			'$.ReworkYn'
	    ,   split_yn			char(1)			'$.SplitYn'
	    ,   merge_yn			char(1)			'$.MergeYn'
	    ,   remark				nvarchar(500)	'$.Remark'
	    ,   eqp_json			nvarchar(max)	'$.OperEqpJson'
        )
)
insert into
	dbo.tb_model_oper_ext
(
	corp_id
,	fac_id
,	model_code
,	operation_seq_no
,	operation_code
,	oper_yn
,	scan_eqp_yn
,	scan_worker_yn
,	scan_material_yn
,	scan_tool_yn
,	scan_panel_yn
,	scan_type
,	start_yn
,	end_yn
,	rework_yn
,	split_yn
,	merge_yn
,	remark
,	eqp_json
,	create_user
,	create_dt
)
select
	@corp_id
,	@fac_id
,	@model_code
,	cte.operation_seq_no
,	cte.operation_code
,	cte.oper_yn
,	cte.scan_eqp_yn
,	cte.scan_worker_yn
,	cte.scan_material_yn
,	cte.scan_tool_yn
,	cte.scan_panel_yn
,	cte.scan_type
,	cte.start_yn
,	cte.end_yn
,	cte.rework_yn
,	cte.split_yn
,	cte.merge_yn
,	cte.remark
,	cte.eqp_json
,	@create_user
,	getdate()
from
	cte
;
