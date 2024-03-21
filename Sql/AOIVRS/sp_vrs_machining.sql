USE [MES]
GO
/****** Object:  StoredProcedure [dbo].[sp_vrs_machining]   Script Date: 2023-03-31 ���� 2:53:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--exec [sp_vrs_machining] 'SIFLEX', 'SIFLEX', 'VPN230330189-00027', '58', 'M-129-01-V016' -> workorder+panelno �� ���� �ǳڹ��ڵ�� �����
--exec [sp_vrs_machining] 'SIFLEX', 'SIFLEX', '', '', '' -> ��ü ������ ���� ���� �� �������� ����

ALTER procedure [dbo].[sp_vrs_machining]
(
	@corp_id	varchar(40) -- ���� ���� ȸ���ڵ�� ��ü
,	@fac_id		varchar(40) -- ���� ���� �����ڵ�� ��ü
,	@workorder	varchar(50)
,	@pnlno	varchar(50)
,	@equip	varchaR(30)
)
as
begin
	set transaction isolation level read uncommitted;
	with cte as
	(
		select * from dbo.fn_vrs_json(@corp_id, @fac_id, @workorder, @pnlno, @equip) where insp_position = 1
	)
	insert into
		dbo.tb_vrs
	select
		@corp_id								as corp_id
	,	@fac_id									as fac_id
	,	[time]									as [time]
	,	mesdate									as mesdate
	,	equip									as eqp_code
	,	workorder								as workorder
	,	null									as vendor_code
	,	null 									as vendor_name
	,	null 									as item_code
	,	null 									as item_description
	,	null 									as item_use_code
	,	null 									as model_code
	,	null 									as model_description
	,	pnlno									as pnlno
	,	xlocation                              	as xlocation   
	,	xlocation_cm                           	as xlocation_cm
	,	ylocation                              	as ylocation   
	,	ylocation_cm                          	as ylocation_cm
	,	ngcode                                 	as ngcode      
	,	filelocation                           	as filelocation
	,	getdate()                             	as inserttime  
	from
		cte
end ;