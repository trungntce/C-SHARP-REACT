--declare @eqpid varchar(100);
--set @eqpid = 'M-085-05-V004';
--
--declare @v_tblname varchar(100);
--declare @status varchar(100);
--
--declare @SQL  NVARCHAR(MAX) ='';  
--declare @SQL_VAR NVARCHAR(MAX) ='';
--
--select @v_tblname = tblb.tablename
--from
--(
--	select * from
--	(
--		select eqcode, tablename
--		from raw_plcsymbol_infotable
--		group by eqcode, tablename
--	) tbla
--	where tbla.eqcode = @eqpid
--) tblb
--
--SET @SQL_VAR = N'@status varchar(100) OUTPUT';  
--SET @SQL = N'SELECT top 1 @status = eqstatus from ' + @v_tblname + N' order by time desc';
--
--EXEC sp_executesql  @SQL, @SQL_VAR,
--@status =  @status OUTPUT;
--
-- if(@status = 'Run')
-- begin
--   select 'OK' as result;
-- end
-- else
-- begin
--   select 'NG' as result;
-- end
select 
	count(*) as interlock_count
from 
	tb_panel_interlock tpi
where
	roll_id = @roll_id		and
	panel_id = @panel_id	and
	off_dt is NULL;