insert into
	dbo.tb_panel_interlock
(
	corp_id
,	fac_id
,	roll_id
,	panel_id
,	item_key
,	interlock_code
,	auto_yn
,	on_remark
,	on_update_user
,	on_dt
)
select
	@corp_id
,	@fac_id
,	null
,	@panel_id
,	null
,	@interlock_code
,	'N'
,	@remark
,	@create_user
,	getdate()
;

update
	dbo.tb_panel_realtime
set
	interlock_yn = 'Y'
where
	panel_id = @panel_id
;