import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Dictionary } from "../../common/types";
import { dateFormat, floatFormat, getLang, getLangAll } from "../../common/utility";
import { judgeName } from "../Trace/TraceDefs";

export const recipeDefs = (api?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: t("@COL_STANDARD_INFORMATION"), //"기준정보",
      children: [
        {
          field: "recipeName",
          headerName: t("@RECIPE_NAME"), //"레시피명",
          width: 300,
          tooltipValueGetter: (d:any) => d.data.recipeName,
          valueFormatter: (d: any) => getLang(d.data.recipeName),
        },
        {
          field: "baseVal",
          headerName: "Base Val",
          width: 80,
        },
      ]
    },
    {
      headerName: t("@EQP_MEASUREMENT_VALUE"), //"설비측정값",
      children: [
        {
          field: "judge",
          headerName: t("@COL_JUDGMENT"), //"판정",
          width: 60,
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