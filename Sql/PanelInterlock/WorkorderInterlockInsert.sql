insert into
	dbo.tb_workorder_interlock
(
	corp_id
,	fac_id
,	workorder
,	panel_row_key
,	panel_group_key
,	oper_seq_no
,	oper_code
,	eqp_code
,	interlock_code
,	auto_yn
,	on_remark
,	on_update_user
,	on_dt
)
select top 1
	@corp_id
,	@fac_id
,	[4m].workorder
,	[4m].row_key
,	[4m].group_key
,	[4m].oper_seq_no
,	[4m].oper_code
,	[4m].eqp_code
,	@interlock_code
,	'N'
,	@remark
,	@create_user
,	getdate()
from
	dbo.tb_panel_4m [4m]
where
	group_key = @panel_group_key
and	workorder = @workorder
;

if @panel_interlock_yn = 'Y'
begin
	
	update
		dbo.tb_panel_realtime
	set
		interlock_yn = 'Y'
	from
		dbo.tb_panel_realtime [real]
	join
		dbo.fn_panel_item_with_4m() item
		on	[real].panel_id = item.panel_id
	where
		item.panel_group_key = @panel_group_key
	;

end