SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED;

declare @to_dt datetime = getdate();

declare	@am8 datetime;
select @am8 = dateadd(hour, 8, cast(cast(@to_dt as date) as datetime));
if datepart(hour, @to_dt) < 8
	select @am8 = dateadd(dd, -1, @am8);

declare @tbl table
(
	startDt	datetime
,	endDt		datetime
,	ssDiff		int
)

insert into @tbl
exec sp_plc_downtime @eqp_code, @to_dt;


if exists(select * from @tbl)
begin
	select
        *
	,   @am8 as today	
	from
        @tbl
;
end
else
begin
	select
		null 	as startDt
	,	null	as endDt
	,	0		as ssDiff 
	,	@am8 as today
end
;