import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Dictionary } from "../../common/types";
import { dateFormat, floatFormat } from "../../common/utility";
import { judgeName } from "../Trace/TraceDefs";

export const columnDefs = (api?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: "설비",
      children: [
        {
          headerName: "설비코드",
          field: "eqpCode",
          width: 150,
          tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
        },
        {
          headerName: "설비명",
          field: "eqpName",
          width: 250,
          tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
        },
        {
          cellClass: "eqp-status",
          headerName: "상태",
          field: "runEqpYn",
          width: 70,
          valueFormatter: (d: any) => d.data.runEqpYn === "Y" ? "O" : "X",
        },
      ]
    },
    {
      headerName: "4M",
      children: [
        {
          field: "workorder",
          headerName: "BATCH",
          width: 220,
          tooltipValueGetter: (d:any) => d.data.workorder,
        },
        {
          headerName: "모델코드",
          field: "modelCode",
          width: 200,
          tooltipValueGetter: (d:any) => d.data.modelCode,
        },
        {
          headerName: "모델명",
          field: "modelDescription",
          width: 330,
          tooltipValueGetter: (d:any) => d.data.modelDescription,
        },
        {
          field: "operDescription",
          headerName: "공정명",
          width: 200,
          tooltipValueGetter: (d:any) => d.data.operDescription,
        },   
        {
          cellClass: "panel4m-status",
          headerName: "상태",
          field: "start4MYn",
          width: 70,
          valueFormatter: (d: any) => d.data.start4MYn === "Y" ? "O" : "X",
        },     
      ]
    },    
  ];

  return defs;
}