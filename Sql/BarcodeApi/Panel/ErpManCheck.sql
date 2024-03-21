--select NAME as worker_name, PERSON_NUM as worker_code
--  from dbo.erp_hrm_person_master
-- where PERSON_NUM = @barcode
--   and EMPLOYE_TYPE = '1'

select top 1 
	worker_code
,	worker_name
from 
(
select
	PERSON_NUM as worker_code
,	NAME as worker_name
from 	
	dbo.erp_hrm_person_idcard
where 
	PERSON_NUM = convert(varchar, @barcode)
	and (EMPLOYE_TYPE = '1' or EMPLOYE_TYPE is null)
union all 
select
	PERSON_NUM as worker_code
,	NAME as worker_name	
from 
	dbo.erp_hrm_person_master
where
	PERSON_NUM = convert(varchar, @barcode)
	and EMPLOYE_TYPE = '1'
)as a


--select distinct 
--    NAME       as worker_name
--,   PERSON_NUM as worker_code
--from 
--    dbo.erp_hrm_person_idcard
--where 
--    PERSON_NUM = @barcode