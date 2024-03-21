import { ColDef } from "ag-grid-community";
import { dateFormat, dayFormat } from "../../../common/utility";
import { TimeFormat } from "../utills/getTimes";
export const CuPlatingDefs: ColDef[] = [
  {
    headerName: "전류 1",
    field: "d001",
    flex: 0.5,
    suppressMovable: true,
  },
  {
    headerName: "전류 2",
    field: "d002",
    flex: 0.5,
    suppressMovable: true,
  },
  {
    headerName: "전류 3",
    field: "d003",
    flex: 0.5,
    suppressMovable: true,
  },
  {
    headerName: "전류 4",
    field: "d004",
    flex: 0.5,
    suppressMovable: true,
  },
  {
    headerName: "업데이트 시간",
    field: "time",
    width: 180,
    suppressMovable: true,
    resizable: false,
    valueFormatter: (d: any) => TimeFormat(d.data.time),
  },
];
export const CuPlatingMonthDefs: ColDef[] = [
  {
    headerName: "날짜",
    field: "time",
    flex: 1,
    valueFormatter: (d: any) => TimeFormat(d.data.time),
  },
  {
    headerName: "전류1 Max",
    field: "maxD001",
    flex: 1,
  },
  {
    headerName: "전류1 Avg",
    field: "avgD001",
    flex: 1,
  },
  {
    headerName: "전류1 Min",
    field: "minD001",
    flex: 1,
  },
  {
    headerName: "전류2 Max",
    field: "maxD002",
    flex: 1,
  },
  {
    headerName: "전류2 Avg",
    field: "avgD002",
    flex: 1,
  },
  {
    headerName: "전류2 Min",
    field: "minD002",
    flex: 1,
  },
  {
    headerName: "전류3 Max",
    field: "maxD003",
    flex: 1,
  },
  {
    headerName: "전류3 Avg",
    field: "avgD003",
    flex: 1,
  },
  {
    headerName: "전류3 Min",
    field: "minD003",
    flex: 1,
  },
  {
    headerName: "전류4 Max",
    field: "maxD004",
    flex: 1,
  },
  {
    headerName: "전류4 Avg",
    field: "avgD004",
    flex: 1,
  },
  {
    headerName: "전류4 Min",
    field: "minD004",
    flex: 1,
  },
];
