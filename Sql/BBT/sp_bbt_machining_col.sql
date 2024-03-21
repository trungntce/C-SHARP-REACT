USE [MES]
GO
/****** Object:  StoredProcedure [dbo].[sp_bbt_machining]    Script Date: 2023-03-25 오후 3:40:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--exec [sp_bbt_machining] 'SIFLEX', 'SIFLEX', 'VMG230112-0096', '69' -> workorder+panelno 는 추후 판넬바코드로 변경됨
--exec [sp_bbt_machining] 'SIFLEX', 'SIFLEX', '', '' -> 전체 데이터 새로 생성 시 공백으로 실행

ALTER procedure [dbo].[sp_bbt_machining]
(
	@corp_id	varchar(40) -- 추후 실제 회사코드로 대체
,	@fac_id		varchar(40) -- 추후 실제 공장코드로 대체
,	@workorder	varchar(50)
,	@panelno	varchar(50)
)
as
begin
	declare @col_list nvarchar(max);

	with cte as
	(
		select
			column_name 
		,	right('00000' + replace(column_name, 'piece', ''), 5) as piece_no
		from 
			INFORMATION_SCHEMA.COLUMNS 
		where 
			table_name = 'raw_bbt_yamaha'
		and
			column_name like 'piece%'
	)
	select 
		@col_list = coalesce(@col_list + ', ', '') + column_name 
	from 
		cte
	order by
		cte.piece_no asc
	;	

	declare @cte nvarchar(max);
	set @cte = N'
	with cte as
	(
		select 
			workorder + ''-'' + right(''0000'' + panelno, 4)	as panel_id
		,	cast(panelno as int)								as panel_seq
		,	cast(replace(piece, ''piece'', '''') as int)		as piece_no
		,	judge
		,	convert(date, mesdate)								as mes_date
		,	workorder											as workorder
		,	equip												as eqp_code
		,	modelname											as model_name
		,	piece												as result
		,	convert(datetime, time)								as start_dt
		,	dateadd(ms, cast(replace(processtime, ''.'', '''') as int), convert(datetime, time))		as end_dt	
		from 
			dbo.raw_bbt_yamaha
		unpivot
		   (judge for piece in (' + @col_list + ')) as unpvt
		where
			(@workorder = '''' or workorder = @workorder)
		and	(@panelno = '''' or panelno = @panelno)
		and	displayseq = ''1''
		and len(judge) > 0
	)
	';

	declare @params nvarchar(max) = N'@corp_id varchar(40), @fac_id varchar(40), @workorder varchar(50), @panelno varchar(50)';

	declare @query nvarchar(max) = @cte + N'
	insert into
		dbo.tb_bbt
	select
		@corp_id											as corp_id
	,	@fac_id												as fac_id
	,	panel_id											as panel_id
	,	max(panel_seq)										as panel_seq
	,	max(mes_date)										as mes_date
	,	max(workorder)										as workorder
	,	max(eqp_code)										as eqp_code
	,	null												as vendor_code
	,	null												as item_code
	,	max(model_name)										as item_name
	,	max(start_dt)										as start_dt
	,	max(end_dt)											as end_dt
	,	sum(case judge when ''GOOD'' then  1 else 0 end)	as ok_cnt
	,	sum(case judge when ''GOOD'' then  0 else 1 end)	as ng_cnt
	,	getdate()											as create_dt
	from
		cte
	group by
		panel_id';
	;

	print @query;
	exec sp_executesql @query, @params, 
		@corp_id = @corp_id
	,	@fac_id = @fac_id
	,	@workorder = @workorder
	,	@panelno = @panelno;


	declare @query_piece nvarchar(max) = @cte + N'
	insert into
		dbo.tb_bbt_piece
	select
		@corp_id											as corp_id
	,	@fac_id												as fac_id
	,	panel_id
	,	piece_no
	,	judge
	,	getdate()
	from
		cte
	where
		judge != ''GOOD''
	order by
		panel_id asc
	,	piece_no asc';

	print @query_piece;
	exec sp_executesql @query_piece, @params, 
		@corp_id = @corp_id
	,	@fac_id = @fac_id
	,	@workorder = @workorder
	,	@panelno = @panelno;

	declare @query_piece_ng nvarchar(max) = @cte + N'
	, cte_ng as
	(
		select 
			workorder + ''-'' + right(''0000'' + panelno, 4)	as panel_id
		,	cast(panelno as int)								as panel_seq
		,	cast(replace(piece, ''piece'', '''') as smallint)	as piece_no
		,	cast(displayseq as int)								as insp_position
		,	insp_val											
		,	pina												as pin_a
		,	pinb												as pin_b
		,	method
		,	thresholdl											as lsl
		,	thresholdu											as usl
		,	convert(datetime, time)								as start_dt
		,	dateadd(ms, cast(replace(processtime, ''.'', '''') as int), convert(datetime, time))		as end_dt	
		from 
			dbo.raw_bbt_yamaha
		unpivot
			(insp_val for piece in (' + @col_list + ')) as unpvt
		where
			(@workorder = '''' or workorder = @workorder)
		and	(@panelno = '''' or panelno = @panelno)
		and	displayseq != ''1''
		and	insp_val != '''' 
		and	isnumeric(insp_val) = 0
	)
	insert into
		dbo.tb_bbt_piece_ng
	select
		@corp_id
	,	@fac_id
	,	ng.panel_id
	,	ng.piece_no
	,	ng.insp_position
	,	cte.judge
	,	ng.insp_val
	,	ng.pin_a
	,	ng.pin_b
	,	ng.method
	,	ng.lsl
	,	ng.usl
	,	getdate()	
	from
		cte_ng as ng
	join
		cte
		on	ng.panel_id = cte.panel_id
		and	ng.piece_no = cte.piece_no';

	print @query_piece_ng;
	exec sp_executesql @query_piece_ng, @params, 
		@corp_id = @corp_id
	,	@fac_id = @fac_id
	,	@workorder = @workorder
	,	@panelno = @panelno;

end 