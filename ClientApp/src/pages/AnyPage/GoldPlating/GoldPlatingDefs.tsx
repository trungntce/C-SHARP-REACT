import { ColDef } from "ag-grid-community";
import { dateFormat, dayFormat } from "../../../common/utility";
import { TimeFormat } from "../utills/getTimes";
export const GoldPlatingDefs: ColDef[] = [
  {
    headerName: "전도도 ( MΩ )",
    field: "paramValue",
    flex: 1,
    maxWidth: 200,
    suppressMovable: true,
    valueFormatter: (d: any) => d.data.paramValue.toFixed(3),
  },
  {
    headerName: "업데이트 시간",
    field: "updateDt",
    flex: 1,
    maxWidth: 200,
    suppressMovable: true,
    resizable: false,
    valueFormatter: (d: any) => TimeFormat(d.data.updateDt),
  },
];
