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
          headerName: "Check Type",
          field: "checkTypeDesc",
          width: 120,
          tooltipValueGetter: (d:any) => d.data.checkTypeDesc,
        },
        {
          headerName: "Check Pos",
          field: "checkPositionDesc",
          width: 90,
          tooltipValueGetter: (d:any) => d.data.checkPositionDesc,
        },
        {
          headerName: "Check No",
          field: "checkNumberDesc",
          width: 90,
          tooltipValueGetter: (d:any) => d.data.checkPositionDesc,
        },
        {
          headerName: "항목판정",
          field: "csStatus",
          width: 80,
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