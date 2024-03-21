import { ColDef } from "ag-grid-community";
import { TimeFormat } from "../../utills/getTimes";

export const DiGridDefs: ColDef[] = [
  {
    field: "eqcode",
    headerName: "설비명",
    minWidth: 220,
    flex: 1,
    resizable: true,
  },
  {
    field: "ngDt",
    headerName: "NG 발생일",
    minWidth: 220,
    flex: 1,
    valueFormatter: ({ data }) => `${TimeFormat(data.minDt)} ~ ${TimeFormat(data.maxDt)}`,
    resizable: true,
  },
  {
    field: "ngValues",
    headerName: "최대/최소",
    minWidth: 120,
    flex: 1,
    valueFormatter: ({ data }) =>
      `${data?.maxValue?.toFixed(2)} / ${data?.minValue?.toFixed(2)}`,
    resizable: true,
  },
  {
    field: "remark",
    headerName: "조치사항",
    minWidth: 220,
    resizable: true,
    editable:true,
  },
];
