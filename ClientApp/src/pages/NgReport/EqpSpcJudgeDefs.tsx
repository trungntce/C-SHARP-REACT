import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Dictionary } from "../../common/types";
import { dateFormat, floatFormat } from "../../common/utility";
import { judgeName } from "../Trace/TraceDefs";

export const columnDefs = (api?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      field: "spcName",
      headerName: "불량유형",
      width: 150,
    },    
    {
      field: "judge",
      headerName: "판정",
      cellClass: "cell-judge-ng",
      width: 55,
      cellRenderer: (d: any) => judgeName(d.data.judge),
    },    
    {
      field: "workorder",
      headerName: "BATCH",
      width: 220,
      tooltipValueGetter: (d:any) => d.data.workorder,
    },
    {
      headerName: "발생공정",
      field: "operCode",
      width: 80,
      cellStyle: {textAlign: 'center'},
      tooltipValueGetter: (d:any) => d.data.operCode,
    },    
    {
      field: "operName",
      headerName: "공정명",
      width: 180,
      tooltipValueGetter: (d:any) => d.data.operDescription,
    },   
    {
      headerName: "발생설비",
      field: "eqpName",
      width: 200,
      tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
    },
    {
      headerName: "제품명",
      field: "itemName",
      width: 200,
      tooltipValueGetter: (d:any) => `[${d.data.modelCode}] ${d.data.modelDescription}`,
    },
    {
      headerName: "모델코드",
      field: "modelCode",
      width: 220,
      tooltipValueGetter: (d:any) => d.data.modelCode,
    },
    {
      headerName: "일시",
      field: "createDt",
      filter: "agDateColumnFilter",
      width: 130,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }
  ];

  return defs;
}