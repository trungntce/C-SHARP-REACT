import { dateFormat } from "../../common/utility";

export const spcErrorDefs = [
  {  
    headerName: "시작시간", 
    field: 'inspDt', 
    flex: 0.8,
    valueFormatter: (d: any) => dateFormat(d.data.inspDt, "YYYY-MM-DD HH:mm")
  },

  {  
    headerName: "공정명", 
    field: 'operDescriptionNg', 
    flex: 1,
    tooltipValueGetter: (d:any) => d.data.operDescriptionNg,
  },
  {  
    headerName: "NG항목", 
    field: 'eqpNameNg', 
    flex: 1.2,
    tooltipValueGetter: (d:any) => d.data.eqpNameNg,
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
    flex: 1.7,
    tooltipValueGetter: (d:any) => d.data.panelId,
  },
  {
    headerName: "고객Min",
    field: "custMin",
    width: 80,
  },
  {
    headerName: "고객Max",
    field: "custMax",
    width: 80,
  },
  {
    headerName: "내부Min",
    field: "innerMin",
    width: 80,
  },
  {
    headerName: "내부Max",
    field: "innerMax",
    width: 80,
  },
  {
    headerName: "측정값",
    field: "inspVal",
    width: 80,
  },
  {
    headerName: "판정",
    field: "csStatus",
    width: 80,
  },
];