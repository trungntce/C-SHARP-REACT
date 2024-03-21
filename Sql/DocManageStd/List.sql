
;with cte as (
select 
 ROW_NUMBER() over (order by  doc_no) as sort
,convert(varchar(10),reg_date,120) reg_date
,doc_no
,doc_type
,doc_name
,doc_content
,att_file
,reg_user
,use_yn
,remark
,[guid]
,[file_name]
,file_path
from dbo.tb_standard_doc_manager with(nolock) 
where 1=0
or case when dept_filter='MID' then 'MID' else '' end = case when '{0}'='MID' then 'MID' else '' end
)
select * from cte
order by sort

