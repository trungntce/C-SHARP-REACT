declare @tbl table
(
	panel_interlock_id int
);

with cte as 
(
	select
		*
	from
		openjson(@panelJson)
		with
		(
			panel_interlock_id varchar(32) '$.id'
		)
)
insert into 
	@tbl
select
	*
from
	cte
;

delete
	dbo.tb_panel_interlock
from
	dbo.tb_panel_interlock interlock
join
	@tbl cte
	on	interlock.panel_interlock_id = cte.panel_interlock_id
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
;

delete 
	dbo.tb_panel_4m_interlock
from
	dbo.tb_panel_4m_interlock interlock
where
	corp_id				= @corp_id
and	fac_id				= @fac_id
and	header_group_key	= @header_group_key
;

--update -- 판넬 인터락 상태는 마지막 판넬 인터락 값 기준으로 원복
--	dbo.tb_panel_realtime
--set
--	interlock_yn = case when inter.off_dt is null then 'Y' else 'N' end
--from
--	dbo.tb_panel_realtime [real]
--join
--	@tbl cte
--	on	[real].panel_id = cte.panel_id
--cross apply
--(
--	select top 1
--		off_dt
--	from
--		dbo.tb_panel_interlock interlock
--	where
--		interlock.panel_id = cte.panel_id
--	order by
--		panel_interlock_id desc
--) inter
--;
