import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Dictionary } from "../../common/types";
import { dateFormat, floatFormat, getLang, getLangAll } from "../../common/utility";
import { judgeName } from "../Trace/TraceDefs";

export const paramDefs = (api?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: t("@COL_STANDARD_INFORMATION"), //"기준정보",
      children: [
        {
          field: "paramName",
          headerName: t("@COL_PARAMETER_NAME"), //"파라미터명",
          width:400,
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
          field: "judge",
          headerName: t("@COL_JUDGMENT"), //"판정",
          width: 55,
          cellRenderer: (d: any) => judgeName(d.data.judge),
        },
        {
          field: "eqpMinVal",
          headerName: `${t("@COL_MIN")}~${t("@COL_MAX")}`, //"최소~최대",
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