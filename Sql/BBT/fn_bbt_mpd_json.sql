USE [MES]
GO
/****** Object:  UserDefinedFunction [dbo].[fn_bbt_mpd_json]    Script Date: 2023-04-16 ¿ÀÀü 2:05:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		ljh
-- Create date: 2023-03-28
-- Description:	bbt mpd json -> cte table Äõ¸®
-- =============================================
ALTER function [dbo].[fn_bbt_mpd_json]
(	
	@corp_id	varchar(40)
,	@fac_id		varchar(40)
,	@lotinfo	varchar(50)
,	@panelno	varchar(50)
,	@eqp_code	varchar(30)
,	@from_dt	date		= null
,	@to_dt		date		= null
)
returns table 
as
return 
(
	with cte as
	(
		select
			row_number() over (partition by equip, lotinfo, panelno order by time desc) as row_no
		,	time
		,	mesdate
		,	finishtime
		,	equip
		,	lotinfo
		,	panelno
		from
			raw_bbt_yamaha_mpd
		where
			(@lotinfo = '' or lotinfo = @lotinfo)
		and	(@panelno = '' or panelno = @panelno)
		and	(@eqp_code = '' or equip = @eqp_code)
		and (@from_dt is null or @to_dt is null or mesdate between @from_dt and @to_dt)
	)
	select
		b.judge
	,	b.insp_val
	,	b.piece_no
	,	r.lotinfo + '-' + right('0000' + r.panelno, 4)		as panel_id
	,	cast(r.panelno as int)								as panel_seq
	,	a.[key] + 1											as insp_position
	,	convert(date, r.mesdate)							as mes_date
	,	r.lotinfo											as workorder
	,	r.equip												as eqp_code
	,	r.modelname											as model_name
	,	r.time												as start_dt
	,	r.finishtime										as end_dt	
	,	b.pin_a
	,	b.pin_b
	,	b.method
	,	b.lsl
	,	b.usl
	from
		cte
	join
		dbo.raw_bbt_yamaha_mpd r
		on	cte.[time]		= r.[time]
		and	cte.mesdate		= r.mesdate
		and	cte.finishtime	= r.finishtime
		and	cte.equip		= r.equip
		and	cte.lotinfo		= r.lotinfo
		and	cte.panelno		= r.panelno
	cross apply
		openjson(datajson) a
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
		cte.row_no = 1
)
