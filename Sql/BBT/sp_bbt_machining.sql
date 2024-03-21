USE [MES]
GO

--delete dbo.tb_bbt;
--delete dbo.tb_bbt_piece;
--delete dbo.tb_bbt_piece_ng;

--exec [sp_bbt_machining] 'SIFLEX', 'SIFLEX', 'VMG230112-0096', '69', 'M-006-01-V005' -> workorder+panelno 는 추후 판넬바코드로 변경됨
--exec [sp_bbt_machining] 'SIFLEX', 'SIFLEX', '', '', '' -> 전체 데이터 새로 생성 시 공백으로 실행

ALTER procedure [dbo].[sp_bbt_machining]
(
	@corp_id	varchar(40) -- 추후 실제 회사코드로 대체
,	@fac_id		varchar(40) -- 추후 실제 공장코드로 대체
,	@workorder	varchar(50)
,	@panelno	varchar(50)
,	@eqp_code	varchaR(30)
,	@from_dt	date		= null
,	@to_dt		date		= null
)
as
begin
	set transaction isolation level read uncommitted;

	delete
		dbo.tb_bbt_piece_ng
	from
		dbo.tb_bbt_piece_ng a
	join 
		dbo.tb_bbt b
		on	a.corp_id = b.corp_id
		and	a.fac_id = b.fac_id
		and	a.panel_id = b.panel_id
		and	a.eqp_code = b.eqp_code
	where
		(@workorder = '' or b.workorder = @workorder)
	and	(@panelno = '' or b.panel_id = workorder + '-' + right('0000' + @panelno, 4))
	and	(@eqp_code = '' or b.eqp_code = @eqp_code)
	and (@from_dt is null or @to_dt is null or b.mes_date between @from_dt and @to_dt)
	;

	delete
		dbo.tb_bbt_piece
	from
		dbo.tb_bbt_piece a
	join 
		dbo.tb_bbt b
		on	a.corp_id = b.corp_id
		and	a.fac_id = b.fac_id
		and	a.panel_id = b.panel_id
		and	a.eqp_code = b.eqp_code
	where
		(@workorder = '' or b.workorder = @workorder)
	and	(@panelno = '' or b.panel_id = workorder + '-' + right('0000' + @panelno, 4))
	and	(@eqp_code = '' or b.eqp_code = @eqp_code)
	and (@from_dt is null or @to_dt is null or b.mes_date between @from_dt and @to_dt)
	;

	delete
		dbo.tb_bbt
	where
		(@workorder = '' or workorder = @workorder)
	and	(@panelno = '' or panel_id = workorder + '-' + right('0000' + @panelno, 4))
	and	(@eqp_code = '' or eqp_code = @eqp_code)		
	and (@from_dt is null or @to_dt is null or mes_date between @from_dt and @to_dt)
	;

	with cte as
	(
		select * from dbo.fn_bbt_json_ex(@corp_id, @fac_id, @workorder, @panelno, @eqp_code, @from_dt, @to_dt) where insp_position = 1
	)
	insert into
		dbo.tb_bbt
	select
		@corp_id											as corp_id
	,	@fac_id												as fac_id
	,	panel_id											as panel_id
	,	max(eqp_code)										as eqp_code
	,	null												as eqp_description
	,	max(panel_seq)										as panel_seq
	,	max(mes_date)										as mes_date
	,	max(workorder)										as workorder
	,	null												as vendor_code
	,	null												as vendor_name
	,	null												as item_code
	,	null												as item_description
	,	max(model_name)										as item_name
	,	null												as item_use_code
	,	null												as item_use_description
	,	null												as model_code
	,	null												as model_description
	,	max(start_dt)										as start_dt
	,	max(end_dt)											as end_dt
	,	sum(case insp_val when 'GOOD' then  1 else 0 end)	as ok_cnt
	,	sum(case insp_val when 'GOOD' then  0 else 1 end)	as ng_cnt
	,	getdate()											as create_dt
	from
		cte
	group by
		panel_id
	;


	with cte as
	(
		select 
			* 
		from
			dbo.fn_bbt_json_ex(@corp_id, @fac_id, @workorder, @panelno, @eqp_code, @from_dt, @to_dt)
		where
			insp_position = 1 
		and	insp_val != 'GOOD'
	)
	insert into
		dbo.tb_bbt_piece
	select
		@corp_id											as corp_id
	,	@fac_id												as fac_id
	,	panel_id
	,	eqp_code
	,	piece_no
	,	start_dt											as [time]
	,	insp_val											as judge
	,	pin_a
	,	pin_b
	,	method
	,	lsl
	,	usl
	,	getdate()
	from
		cte
	order by
		panel_id asc
	,	piece_no asc
	;


    with cte as
    (
        select 
            * 
        from
            dbo.fn_bbt_json_ex(@corp_id, @fac_id, @workorder, @panelno, @eqp_code, @from_dt, @to_dt)
        where
            insp_position = 1 
        and insp_val != 'GOOD'
    ), cte2 as
    (
        select
            a.panel_id
        ,   a.eqp_code
        ,   a.piece_no
        ,   a.insp_position
        ,   a.pin_a
        ,   a.pin_b
        ,   a.method
        ,   a.start_dt    as [time]
        ,   a.judge
        ,   a.insp_val
        ,   a.lsl
        ,   a.usl
        from
            dbo.fn_bbt_mpd_json_ex(@corp_id, @fac_id, @workorder, @panelno, @eqp_code, @from_dt, @to_dt) a
        join
            cte
            on  cte.panel_id     = a.panel_id
            and cte.eqp_code     = a.eqp_code
            and cte.piece_no     = a.piece_no
    )
    insert into
        dbo.tb_bbt_piece_ng
    select
	    @corp_id				as corp_id
    ,	@fac_id					as fac_id
    ,	cte2.panel_id
    ,	cte2.eqp_code
    ,	cte2.piece_no
    ,	cte2.insp_position

    ,	cte2.judge
    ,   null
    ,   cte2.insp_val
    ,   null
    ,   cte2.pin_a
    ,   cte2.pin_b
    ,   cte2.method
    ,   cte2.lsl
    ,   cte2.usl

    ,	getdate()				as create_dt
    from
        cte2
	order by
		panel_id asc
	,	piece_no asc
	,	pin_a asc
	;

end 