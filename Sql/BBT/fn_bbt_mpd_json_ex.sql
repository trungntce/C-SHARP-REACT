USE [MES]
GO

ALTER function  [dbo].[fn_bbt_mpd_json_ex]
(
	@corp_id	varchar(40)
,	@fac_id		varchar(40)
,	@lotinfo	varchar(50)
,	@panelno	varchar(50)
,	@eqp_code	varchar(30)
,	@from_dt	date		= null
,	@to_dt		date		= null
)
RETURNS 
@tbl TABLE 
(
	judge			varchar(20)
,	insp_val		float
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
			lotinfo
		,	panelno
		,	mesdate
		,	equip
		,	modelname
		,	time
		,	finishtime
		,	datsjson
		from
			dbo.raw_bbt_yamaha_mpd with (nolock)
		where
			(@lotinfo = '' or lotinfo = @lotinfo)
		and	(@panelno = '' or panelno = @panelno)
		and	(@eqp_code = '' or equip = @eqp_code)
		and (@from_dt is null or @to_dt is null or mesdate between @from_dt and @to_dt)
		and	len(lotinfo) > 0
	)
	insert into
		@tbl
	select
		b.judge
	,	b.insp_val
	,	b.piece_no
	,	raw.lotinfo + '-' + right('0000' +	raw.panelno, 4)	as panel_id
	,	cast(raw.panelno as int)							as panel_seq
	,	a.[key] + 1											as insp_position
	,	convert(date, raw.mesdate)							as mes_date
	,	raw.lotinfo											as workorder
	,	raw.equip											as eqp_code
	,	raw.modelname										as model_name
	,	raw.time											as start_dt
	,	raw.finishtime										as end_dt	
	,	b.pin_a
	,	b.pin_b
	,	b.method
	,	b.lsl
	,	b.usl
	from
		cte raw
	cross apply
		openjson(raw.datsjson) a
	cross apply
		openjson(a.[value])
		with
		(
			[time]		datetime	'$.tm'
		,	piece_no	int			'$.pi'
		,	[pin_a]		varchar(10)	'$.a'
		,	[pin_b]		varchar(10)	'$.b'
		,	method		int			'$.me'
		,	lsl			float		'$.ls'
		,	usl			float		'$.us'
		,	judge		varchar(20) '$.jg'
		,	insp_val	float		'$.val'
		) b	
	where 
		len(lotinfo) > 0
	option (force order)
	;
	
	RETURN;
END
