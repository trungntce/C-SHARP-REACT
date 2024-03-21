delete from dbo.tb_checksheet_group_eqp where checksheet_group_code = @checksheet_group_code and eqp_code = @equipment_code;

insert into 
	dbo.tb_checksheet_group_eqp
(

	checksheet_group_code
,	eqp_code
,	use_yn
,	create_dt
)
select
	@checksheet_group_code
,	@equipment_code
,	@use_yn
,	getdate()
;