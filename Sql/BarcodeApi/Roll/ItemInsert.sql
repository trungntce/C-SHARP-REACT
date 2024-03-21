insert into 
	dbo.tb_roll_item
(
	row_key
,	roll_row_key
,	ip_addr
,	roll_id
,	scan_dt
,	create_dt
)
select
	@row_key
,	@roll_row_key
,	@ip_addr
,	@roll_id
,	@scan_dt
,	getdate()
;