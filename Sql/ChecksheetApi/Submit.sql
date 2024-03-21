insert into 
	dbo.tb_checksheet_result
(
	checksheet_code
,	checksheet_item_code
,	check_date
,	check_status
,	check_user
,	check_value
,	day_type
)
select
	@checksheet_code
,	@checksheet_item_code
,	@check_date
,	@check_status
,	@create_user
,	@check_value
,	@day_type
;

declare @cnt int;
select @cnt = count(1) 
from tb_checksheet_day_result 
where checksheet_code = @checksheet_code
	and checksheet_item_code = @checksheet_item_code
	and day_type = @day_type
	and check_date = format(@check_date, 'yyyyMMdd')
;

IF @cnt > 0
	UPDATE tb_checksheet_day_result
		SET
			check_status = @check_status
			, check_user = @create_user
			, check_value = @check_value
		WHERE 
			checksheet_code = @checksheet_code
			and checksheet_item_code = @checksheet_item_code
			and day_type = @day_type
			and check_date = format(@check_date, 'yyyyMMdd');
ELSE
	INSERT INTO tb_checksheet_day_result(
		checksheet_code,
		checksheet_item_code,
		day_type,
		check_date,
		check_status,
		check_value,
		check_user,
		create_dt
	)
	VALUES(
		@checksheet_code,
		@checksheet_item_code,
		@day_type,
		format(@check_date, 'yyyyMMdd'),
		@check_status,
		@check_value,
		@create_user,
		@check_date
	);
			