;with cte as (
SELECT ROW_NUMBER() over (order by  IIM.CREATION_DATE desc) as sort,
SIR.BOM_ITEM_CODE, SIR.BOM_ITEM_DESCRIPTION,  
convert(varchar(19),IIM.CREATION_DATE,120) as CREATION_DATE , 
case  when isnull(tnc.recipe,'')<>'OK' or  isnull(tnc.bbt_no,'')<>'OK' or isnull(tnc.black_hold_align,'')<>'OK' or isnull(tnc.gbr_data,'')<>'OK'or isnull(tnc.spc,'')<>'OK' then 'NG' else 'OK' end as Total
, tnc.* 
FROM erp_inv_item_master IIM with(nolock)
LEFT JOIN erp_sdm_item_revision SIR  with(nolock) ON IIM.INVENTORY_ITEM_ID = SIR.INVENTORY_ITEM_ID
left join tb_newmodel_checksheet tnc with(nolock) on SIR.BOM_ITEM_CODE = tnc.model_code
WHERE  IIM.ITEM_SECTION_CODE IN ('C', 'NORMAL')       -- C = 시양산  / NORMAL = 양산       
and IIM.ITEM_CATEGORY_CODE <> 'SFG'
AND IIM.CREATION_DATE >= DATEADD(MONTH, -3, GETDATE())
AND IIM.CREATION_DATE <= GETDATE()
and SIR.BOM_ITEM_CODE is not null
)

select * from cte
union all
select 0
,(select convert(varchar(5),count(*)) from cte)
, (select convert(varchar(5),count(*)) from cte)
, ''
, 'OK '+(select convert(varchar(5),count(*)) from cte where Total='OK')+' / NG '+(select convert(varchar(5),count(*)) from cte where Total='NG')
,(select convert(varchar(5),count(*)) from cte)
, 'OK '+(select convert(varchar(5),count(*)) from cte where recipe='OK')+' / NG '+(select convert(varchar(5),count(*)) from cte where recipe='NG')
, 'OK '+(select convert(varchar(5),count(*)) from cte where gbr_data='OK')+' / NG '+(select convert(varchar(5),count(*)) from cte where gbr_data='NG')
, 'OK '+(select convert(varchar(5),count(*)) from cte where bbt_no='OK')+' / NG '+(select convert(varchar(5),count(*)) from cte where bbt_no='NG')
, 'OK '+(select convert(varchar(5),count(*)) from cte where black_hold_align='OK')+' / NG '+(select convert(varchar(5),count(*)) from cte where black_hold_align='NG')
, 'OK '+(select convert(varchar(5),count(*)) from cte where spc='OK')+' / NG '+(select convert(varchar(5),count(*)) from cte where spc='NG')
, 'OK '+(select convert(varchar(5),count(*)) from cte where other='OK')+' / NG '+(select convert(varchar(5),count(*)) from cte where other='NG')
order by  sort
