select 
	a.*
from
(
	select
		max(a.mesdate)					as mesdate,
		max(a.vendor_name)				as vendor_name,
		max(a.item_code)				as item_code,
		max(a.item_description)			as item_name,
		max(a.eqp_code)					as eqp_code,
		max(a.model_code)				as model_code,
		'' as [app_code],
		'' as [app_name],
		max(SSE.EQUIPMENT_DESCRIPTION)	as [eqp_name],
		max(a.workorder)				as workorder ,
		max(a.pnlno)					as panel_seq,
		string_agg(a.pnlno, ',')		as panel_seq_list,
		count(distinct a.pnlno)			as panel_cnt,
		a.piece_no,
		count(a.workorder) 	as ngcnt,
		isnull(sum(case a.ngcode	when 0  then 1 else 0 end), 0) as [none],
		isnull(sum(case a.ngcode	when 1  then 1 else 0 end), 0) as [short_df],
		isnull(sum(case a.ngcode	when 2  then 1 else 0 end), 0) as [short_et],
		isnull(sum(case a.ngcode	when 3  then 1 else 0 end), 0) as [short_md],
		isnull(sum(case a.ngcode	when 4  then 1 else 0 end), 0) as [short_df_repair],
		isnull(sum(case a.ngcode	when 5  then 1 else 0 end), 0) as [short_et_repair],
		isnull(sum(case a.ngcode	when 6  then 1 else 0 end), 0) as [short_md6],
		isnull(sum(case a.ngcode	when 7  then 1 else 0 end), 0) as [open_df],
		isnull(sum(case a.ngcode	when 8  then 1 else 0 end), 0) as [open_et],
		isnull(sum(case a.ngcode	when 9  then 1 else 0 end), 0) as [open_madong],
		isnull(sum(case a.ngcode	when 10 then 1 else 0 end), 0) as [slit_df],
		isnull(sum(case a.ngcode	when 11 then 1 else 0 end), 0) as [slit_et],
		isnull(sum(case a.ngcode	when 12 then 1 else 0 end), 0) as [slit_madong],
		isnull(sum(case a.ngcode	when 13 then 1 else 0 end), 0) as [open_qc],
		isnull(sum(case a.ngcode	when 14 then 1 else 0 end), 0) as [dong_cuc4],
		isnull(sum(case a.ngcode	when 15 then 1 else 0 end), 0) as [dong_cuc5],
		isnull(sum(case a.ngcode	when 16 then 1 else 0 end), 0) as [pine_hole],
		isnull(sum(case a.ngcode	when 17 then 1 else 0 end), 0) as [lech_hole_df],
		isnull(sum(case a.ngcode	when 18 then 1 else 0 end), 0) as [lech_hole_cnc],
		isnull(sum(case a.ngcode	when 19 then 1 else 0 end), 0) as [chua_mon],
		isnull(sum(case a.ngcode	when 20 then 1 else 0 end), 0) as [tran_dong0],
		isnull(sum(case a.ngcode	when 21 then 1 else 0 end), 0) as [tran_dong1],
		isnull(sum(case a.ngcode	when 22 then 1 else 0 end), 0) as [tac_hole],
		isnull(sum(case a.ngcode	when 23 then 1 else 0 end), 0) as [tenting],
		isnull(sum(case a.ngcode	when 24 then 1 else 0 end), 0) as [pjt],
		isnull(sum(case a.ngcode	when 25 then 1 else 0 end), 0) as [khac],
		isnull(sum(case a.ngcode	when 26 then 1 else 0 end), 0) as [short_df_aor],
		isnull(sum(case a.ngcode	when 27 then 1 else 0 end), 0) as [short_et_aor],
		isnull(sum(case a.ngcode	when 28 then 1 else 0 end), 0) as [short_md_aor],
		isnull(sum(case a.ngcode	when 29 then 1 else 0 end), 0) as [dc_aor],
		isnull(sum(case a.ngcode	when 30 then 1 else 0 end), 0) as [aor],
		isnull(sum(case a.ngcode	when 31 then 1 else 0 end), 0) as [miss_feature],
		isnull(sum(case a.ngcode	when 32 then 1 else 0 end), 0) as [skip_pcb],
		isnull(sum(case a.ngcode	when 33 then 1 else 0 end), 0) as [short_point]
	from
		dbo.tb_vrs a 
	join 
		tb_code b
		on b.codegroup_id = 'VRS_NG_CODE'
		and b.code_id 		= a.ngcode 
	left join 
		erp_sdm_standard_equipment SSE 
		on SSE.EQUIPMENT_CODE = a.eqp_code
	where
		a.workorder = @workorder
	and a.pnlno = cast(@panel_seq as varchar)
	and a.pnlno in (select [value] from string_split(@panel_list, ','))
	and a.piece_no != -9999
	group by
		a.piece_no
)	a
;