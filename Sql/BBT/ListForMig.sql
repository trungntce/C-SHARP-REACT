select
	'SIFLEX'									as corp_id
,	'SIFLEX'									as fac_id
,	a.workorder + '-' + right('0000' + a.panelno, 4)	as panel_id
,	convert(date, a.mesdate, 120)				as mes_date
,	a.equip										as eqp_id
,	a.workorder									as workorder
,	cast(a.panelno as smallint)					as panel_seq
,	a.modelname									as model_name
,	convert(datetime, a.time, 121)				as start_dt
,	dateadd(
		s, 
		cast(replace(a.processtime, '.', '') as int),
		convert(datetime, a.time, 121))			as end_dt
,	0											as ok_cnt
,	0											as ng_cnt
,	getdate()									as create_dt
from
	dbo.raw_bbt_yamaha a
where
	displayseq = '1'
;

select 
	c.name as colname, 
	t.name as tablename,
	c.column_id
from 
	sys.columns c
join sys.tables t on c.object_id = t.object_id
where 
	t.name = 'raw_bbt_yamaha'
and	c.name like 'piece%'
order by
	c.column_id
;