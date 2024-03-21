import { ColDef } from "ag-grid-community";

export const columnDefs: ColDef[] = [
  {
    headerName: "설비코드",
    field: "eqp_code",
    maxWidth: 200,
    flex: 1,
  },
  {
    headerName: "설비명",
    field: "eqp_description",
    maxWidth: 400,
  },
  {
    headerName: "계획시간",
    field: "total_time",
    maxWidth: 200,
    flex: 1,
  },
  {
    headerName: "비가동시간",
    field: "off_time",
    maxWidth: 200,
    flex: 1,
  },
  {
    headerName: "누적 S/T",
    field: "st",
    maxWidth: 200,
    flex: 1,
  },
  {
    headerName: "실시간 S/T",
    field: "real_st",
    maxWidth: 200,
    flex: 1,
  },
  {
    headerName: "생산수량",
    field: "prod_cnt",
    maxWidth: 200,
    flex: 1,
  },
  {
    headerName: "시간가동률",
    field: "time_rate",
    maxWidth: 200,
    flex: 1,
  },
  {
    headerName: "성능가동률",
    field: "perfor_rate",
    maxWidth: 200,
    flex: 1,
  },
  {
    headerName: "OEE",
    field: "oee",
    maxWidth: 200,
    flex: 1,
  },
];
