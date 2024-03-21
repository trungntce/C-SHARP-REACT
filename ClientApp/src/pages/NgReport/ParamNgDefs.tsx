import { dateFormat } from "../../common/utility";

export const paramErrorDefs = [
  {  
    headerName: "시작시간", 
    field: 'eqpStartDt', 
    flex: 0.8,
    valueFormatter: (d: any) => dateFormat(d.data.eqpStartDt, "YYYY-MM-DD HH:mm")
  },
  {  
    headerName: "종료시간", 
    field: 'eqpEndDt', 
    flex: 0.8,
    valueFormatter: (d: any) => dateFormat(d.data.eqpEndDt, "YYYY-MM-DD HH:mm")
  },
  {  
    headerName: "공정명", 
    field: 'operDescriptionNg', 
    flex: 1.2,
    tooltipValueGetter: (d:any) => d.data.operDescriptionNg,
  },
  {  
    headerName: "설비명", 
    field: 'eqpNameNg', 
    flex: 1.5,
    tooltipValueGetter: (d:any) => d.data.eqpNameNg,
  },
  {  
    headerName: "Paramerter 항목", 
    field: 'paramName', 
    flex:1,
    tooltipValueGetter: (d:any) => d.data.paramName,
  },
  {  
    headerName: "하한", 
    field: 'lcl', 
    flex: 0.4,
  },
  {  
    headerName: "상한", 
    field: 'ucl', 
    flex: 0.4,
  },
  {  
    headerName: "측정", 
    field: 'eqpVal', 
    flex: 0.5,
    valueFormatter: (d:any) => {return (d.data.eqpMinVal + " ~ " + d.data.eqpMaxVal)},
  },
  {  
    headerName: "모델명", 
    field: 'modelDescription', 
    flex: 1.5,
    tooltipValueGetter: (d:any) => d.data.modelDescription,
  },
  {  
    headerName: "Affect BATCH", 
    field: 'workorderNg', 
    flex: 1,
    tooltipValueGetter: (d:any) => d.data.workorderNg,
  },
  {  
    headerName: "Affect PNL", 
    field: 'panelId', 
    flex: 1,
    tooltipValueGetter: (d:any) => d.data.panelId,
  }
];