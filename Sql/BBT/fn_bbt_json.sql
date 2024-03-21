USE [MES]
GO
/****** Object:  UserDefinedFunction [dbo].[fn_bbt_json]    Script Date: 2023-04-16 ¿ÀÀü 1:55:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		ljh
-- Create date: 2023-03-26
-- Description:	bbt json -> cte table Äõ¸®
-- =============================================
ALTER function [dbo].[fn_bbt_json]
(	
	@corp_id	varchar(40)
,	@fac_id		varchar(40)
,	@workorder	varchar(50)
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
            row_number() over (partition by equip, workorder, panelno, displayseq order by time desc) as row_no
        ,   time
        ,   mesdate
        ,   equip
        ,   workorder
        ,   panelno
        ,   modelname
        ,   processtime
        ,   displayseq
        from 
            raw_bbt_yamaha 
		where
			(@workorder = '' or workorder = @workorder)
		and	(@panelno = '' or panelno = @panelno)
		and	(@eqp_code = '' or equip = @eqp_code)
		and (@from_dt is null or @to_dt is null or mesdate between @from_dt and @to_dt)
    )
	select
		a.[value] as insp_val
	,	a.[key] + 1 as piece_no
	,	raw.workorder + '-' + right('0000' + raw.panelno, 4)	as panel_id
	,	cast(raw.panelno as int)								as panel_seq
	,	raw.displayseq											as insp_position
	,	convert(date, raw.mesdate)								as mes_date
	,	raw.workorder											as workorder
	,	raw.equip												as eqp_code
	,	raw.modelname											as model_name
	,	convert(datetime, raw.[time])							as start_dt
	,	dateadd(ms, cast(replace(raw.processtime, '.', '') as int), convert(datetime, raw.[time]))		as end_dt	
	,	pina													as pin_a
	,	pinb													as pin_b
	,	method
	,	thresholdl												as lsl
	,	thresholdu												as usl
	from
		cte
    join
        dbo.raw_bbt_yamaha raw
        on  cte.time        = raw.time       
        and cte.mesdate     = raw.mesdate
        and cte.equip       = raw.equip
        and cte.workorder   = raw.workorder
        and cte.panelno     = raw.panelno
        and cte.modelname   = raw.modelname
        and cte.processtime = raw.processtime
        and cte.displayseq  = raw.displayseq
	cross apply
		openjson(piecejson, '$.piece') as a
	where
        cte.row_no = 1
	and len(a.[value]) > 0
)
