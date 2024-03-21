USE [MES]
GO

ALTER function  [dbo].[fn_bbt_json_ex]
(
	@corp_id	varchar(40)
,	@fac_id		varchar(40)
,	@workorder	varchar(50)
,	@panelno	varchar(50)
,	@eqp_code	varchar(30)
,	@from_dt	date		= null
,	@to_dt		date		= null
)
RETURNS 
@tbl TABLE 
(
	insp_val		varchar(30)
,	piece_no		int
,	panel_id		varchar(50)
,	panel_seq		int
,	insp_position	int
,	mes_date		date	
,	workorder		varchar(50)
,	eqp_code		varchar(30)
,	model_name		varchar(50)
,	start_dt		datetime
,	end_dt			datetime
,	pin_a			varchar(10)
,	pin_b			varchar(10)
,	method			varchar(10)
,	lsl				float
,	usl				float
)
AS
BEGIN

	with cte as
	(
		select top 1
			workorder
		,	panelno
		,	mesdate
		,	equip
		,	modelname
		,	[time]
		,	processtime
		,	datajson
		from
			dbo.raw_bbt_yamaha with (nolock)
		where
			(@workorder = '' or workorder = @workorder)
		and	(@panelno = '' or panelno = @panelno)
		and	(@eqp_code = '' or equip = @eqp_code)
		and (@from_dt is null or @to_dt is null or mesdate between @from_dt and @to_dt)        
	)
	insert into
		@tbl
	select
		c.[value]                                               as insp_val
	,	c.[key] + 1                                             as piece_no
	,	raw.workorder + '-' + right('0000' + raw.panelno, 4)	as panel_id
	,	cast(raw.panelno as int)								as panel_seq
	,	a.[key] + 1 											as insp_position
	,	convert(date, raw.mesdate)								as mes_date
	,	raw.workorder											as workorder
	,	raw.equip												as eqp_code
	,	raw.modelname											as model_name
	,	convert(datetime, raw.[time])							as start_dt
	,	dateadd(ms, cast(replace(raw.processtime, '.', '') as int), convert(datetime, raw.[time]))		as end_dt	
	,	b.pin_a
	,	b.pin_b
	,	b.method
	,	b.lsl
	,	b.usl
	from
        cte raw
    cross apply
        openjson(raw.datajson) a
    cross apply
        openjson(a.[value])
        with
        (
            [pin_a]     varchar(10)     '$.a'
        ,   [pin_b]     varchar(10)     '$.b'
        ,   method      int             '$.me'
        ,   lsl         float           '$.ls'
        ,   usl         float           '$.us'
        ,   piece       nvarchar(max)   '$.piece' as json
        ) b
    cross apply
        openjson(b.piece) c
	where
		len(c.[value]) > 0
	option (force order)
	;
	
	RETURN;
END
