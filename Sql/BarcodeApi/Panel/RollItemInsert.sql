insert into
	dbo.tb_roll_item
(
	 row_key
	,roll_row_key
	,roll_group_key
	,roll_id
	,create_dt
)
select
    @row_key
   ,@roll_row_key
   ,@roll_group_key
   ,@roll_id
   ,GETDATE()