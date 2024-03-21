import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Dictionary } from "../../common/types";
import { dateFormat, floatFormat } from "../../common/utility";
import { judgeName } from "../Trace/TraceDefs";

export const columnDefs = (api?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: "판넬기본정보",
      children: [
        {
          field: "workorder",
          headerName: "BATCH",
          width: 180,
          tooltipValueGetter: (d:any) => d.data.workorder,
        },
        // {
        //   headerName: "모델코드",
        //   field: "modelCode",
        //   width: 200,
        //   tooltipValueGetter: (d:any) => d.data.modelCode,
        // },
        {
          headerName: "모델명",
          field: "modelDescription",
          width: 180,
          tooltipValueGetter: (d:any) => `[${d.data.modelCode}] ${d.data.modelDescription}`,
        },
        {
          cellClass: "cell-panelid",
          field: "panelId",
          headerName: "판넬바코드",
          width: 220,
          tooltipValueGetter: (d:any) => d.data.panelId,
        },
      ]
    },      
    {
      headerName: "측정",
      children: [
        {
          headerName: "PV명",
          field: "paramName",
          width: 170,
          tooltipValueGetter: (d:any) => d.data.paramName,
        },
        
        {
          headerName: "STD",
          field: "std",
          width: 60,
        },
        {
          field: "lcl",
          headerName: "LCL~UCL",
          width: 95,
          valueFormatter: (d: any) =>`${d.data.lcl}~${d.data.ucl}`,
        },
        {
          field: "lsl",
          headerName: "LSL~USL",
          width: 95,
          valueFormatter: (d: any) =>`${d.data.lsl}~${d.data.usl}`,
        },
        {
          field: "judge",
          headerName: "판정",
          width: 55,
          cellRenderer: (d: any) => judgeName(d.data.judge),
        },
        {
          field: "eqpMinVal",
          headerName: "최소~최대",
          width: 95,
          valueFormatter: (d: any) =>`${d.data.eqpMinVal}~${d.data.eqpMaxVal}`,
        },
        {
          field: "eqpAvgVal",
          headerName: "평균",
          width: 60,
          valueFormatter: (d: any) => floatFormat(d.data.eqpAvgVal, 2),
        },        
      ]
    },
    {
      headerName: "NG공정",
      children: [
        {
          headerName: "설비명",
          field: "eqpNameNg",
          width: 170,
          tooltipValueGetter: (d:any) => `[${d.data.eqpCodeNg}] ${d.data.eqpNameNg}`,
        },
        {
          field: "operDescriptionNg",
          headerName: "공정명",
          width: 150,
          tooltipValueGetter: (d:any) => d.data.operDescriptionNg,
        },   
        {
          headerName: "일시",
          field: "createDt",
          filter: "agDateColumnFilter",
          width: 130,
          valueFormatter: (d: any) => dateFormat(d.data.createDt4MNg)
        }
      ]
    },

    {
      headerName: "인터락공정",
      children: [
        {
          headerName: "설비명",
          field: "eqpName",
          width: 170,
          tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
        },
        {
          field: "operDescription",
          headerName: "공정명",
          width: 150,
          tooltipValueGetter: (d:any) => d.data.operDescription,
        },   
        {
          headerName: "일시",
          field: "createDt",
          filter: "agDateColumnFilter",
          width: 130,
          valueFormatter: (d: any) => dateFormat(d.data.createDt4M)
        }
      ]
    },    
  ];

  return defs;
}