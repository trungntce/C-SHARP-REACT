select
	max(rbc.[time]) as [time]
,	max(trpm.panel_id) as panel_id
,	rbc.num
,	rbc.filelocation 
,	max(rbc.wd)	as wd
,	max(rbc.crt) as crt
,	fjd
from 
	dbo.tb_roll_panel_map trpm 
join
	dbo.raw_blackhole_cmi rbc 
	on trpm.panel_id = rbc.barcode 
where
	trpm.roll_id	= @roll_id 
	and rbc.fjd		= @fjd
group by rbc.num, rbc.filelocation, rbc.fjd 