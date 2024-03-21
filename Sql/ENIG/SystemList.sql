select
	distinct
	codegroup_id 
,	codegroup_name 
from
	tb_codegroup a
where
	codegroup_id like '%DIWATER%'
;

--with cte as
--(
--	select
--		a.codegroup_id
--	,	a.codegroup_name 
--	,	b.code_id
--	from
--		tb_codegroup a
--	left join tb_code b
--		on a.codegroup_id = b.codegroup_id 
--	where
--		a.codegroup_id like 'DIWATER%'
--)
--
--select
--	'DiWater#0' + right(codegroup_id,1) as codegroup_id
--,	'DIWATER#0' + right(codegroup_id,1) + ' (' + cast(count(*) as varchar) + ' EA)' as cnt
--from
--	cte
--group by
--	codegroup_id	