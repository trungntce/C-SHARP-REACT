import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Dictionary } from "../../common/types";
import { dateFormat, floatFormat, getLang, getLangAll } from "../../common/utility";
import { judgeName } from "../Trace/TraceDefs";

export const paramDefs = (api?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: t("@INFORMATION"),  //"BATCH 정보",
      children: [
        {
          field: "workorder",
          headerName: "LOT",
          width: 180,
          tooltipValueGetter: (d:any) => d.data.workorder,
        },
        // {
        //   headerName: "제품명",
        //   field: "itemDescription",
        //   width: 150,
        //   tooltipValueGetter: (d:any) => d.data.itemDescription,
        // },
        {
          headerName: t("@COL_MODEL_CODE"),  //"모델코드",
          field: "modelCode",
          width: 160,
          tooltipValueGetter: (d:any) => d.data.modelCode,
        },
      ]
    },
    {
      headerName: t("@OPERATION"), //"공정",
      children: [
        // {
        //   field: "operSeqNo",
        //   headerName: "공순",
        //   maxWidth: 55,
        // },
        // {
        //   field: "operCode",
        //   headerName: "공정코드",
        //   width: 80,
        //   cellRenderer: (d: any) => {
        //     return d.data.operCode || d.data.operCode4M
        //   }
        // },

        //23-12-04 다국어 변환을 위한 주석
        // {
        //   field: "operDescription",
        //   headerName: t("@COL_OPERATION_NAME"), //"공정명",
        //   width: 180,
        //   tooltipValueGetter: (d:any) => d.data.operDescription,
        // },     
        {
          field: "tranOperName",
          headerName: t("@COL_OPERATION_NAME"), //"공정명",
          width: 250,
          tooltipValueGetter: (d:any) => d.data.operDescription,
          valueFormatter: (d: any) => getLang(d.data.tranOperName)
        },        
        {
          headerName: t("@COL_EQP_NAME"),  //"설비명",
          field: "eqpName",
          width: 120,
          tooltipValueGetter: (d:any) => `[${d.data.eqpCode}] ${d.data.eqpName}`,
        },      
      ]
    },
    {
      headerName: t("@LOOKUP"), //"조회",
      children: [
        {
          field: "judge",
          headerName: t("@COL_JUDGMENT"), //"판정",
          width: 55,
          cellRenderer: (d: any) => judgeName(d.data.judge),
        },
        {
          field: "panel",
          headerName: t("@COL_RELATED_PANEL"),  //"관련판넬",
          width: 80,
          cellRenderer: (d: any) => {
            return (
              <>
                <span className="detail-cell">
                  <a onClick={() => {
                    api.panelSearch(d.data);
                  }}>
                    <span className="detail-cell-panel">PANEL</span>
                    {' '}
                    <i className="fa fa-search"></i></a>
                </span>
              </>
            )
          }
        },
      ]
    },        
    {
      headerName: t("@COL_STANDARD_INFORMATION"), //"기준정보",
      children: [
        {
          field: "paramName",
          headerName: t("@COL_PARAMETER_NAME"), //"파라미터명",
          width: 400,
          tooltipValueGetter: (d:any) => d.data.paramName,
          valueFormatter: (d: any) => getLang(d.data.paramName),
        },
        {
          field: "std",
          headerName: "STD",
          width: 55,
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
      ]
    },    
    {
      headerName: t("@EQP_MEASUREMENT_VALUE"), //"설비 측정값",
      children: [
        {
          field: "eqpMinVal",
          headerName: `${t("@COL_MIN")}~${t("@COL_MAX")}`, //"최소~최대"
          width: 95,
          valueFormatter: (d: any) =>`${d.data.eqpMinVal}~${d.data.eqpMaxVal}`,
        },
        {
          field: "eqpAvgVal",
          headerName: t("@COL_AVG"), //"평균",
          width: 60,
          valueFormatter: (d: any) => floatFormat(d.data.eqpAvgVal, 2),
        },
        {
          field: "eqpStartDt",
          headerName: "Start",
          valueFormatter: (d: any) => dateFormat(d.data.eqpStartDt, "MM-DD HH:mm"),
          tooltipValueGetter: (d:any) => dateFormat(d.data.eqpStartDt, "YYYY-MM-DD HH:mm:ss"),
          width: 90
        },
        {
          field: "eqpEndDt",
          headerName: "End",
          valueFormatter: (d: any) => dateFormat(d.data.eqpEndDt, "HH:mm"),
          tooltipValueGetter: (d:any) => dateFormat(d.data.eqpEndDt, "YYYY-MM-DD HH:mm:ss"),
          width: 55
        },
      ]
    },
  ];

  return defs;
}