import { ColDef } from "ag-grid-community";
import { dateFormat, dayFormat } from "../../../common/utility";
export const PreProcessingDefs: ColDef[] = [
  // {
  //   headerName: "장비명",
  //   field: "equip",
  //   flex: 1.5,
  // },
  {
    headerName: "H2SO4 PV",
    field: "h2so4Pv",
    flex: 1,
  },
  // {
  //   headerName: "H2SO4 1day",
  //   field: "h2so41Day",
  //   flex: 1,
  // },
  // {
  //   headerName: "H2SO4 TOTAL",
  //   field: "h2so4Total",
  //   flex: 1,
  // },
  {
    headerName: "H2O2 PV",
    field: "h2o2Pv",
    flex: 1,
  },
  // {
  //   headerName: "H2O2 1day",
  //   field: "h2o21Day",
  //   flex: 1,
  // },
  // {
  //   headerName: "H2O2 Total",
  //   field: "h2o2Total",
  //   flex: 1,
  // },
  {
    headerName: "Cu Pv",
    field: "cuPv",
    flex: 1,
  },
  // {
  //   headerName: "Cu 1day",
  //   field: "cu1Day",
  //   flex: 1,
  // },
  // {
  //   headerName: "Cu Total",
  //   field: "cuTotal",
  //   flex: 1,
  // },
  {
    headerName: "Temp Pv",
    field: "tempPv",
    flex: 1,
  },
  // {
  //   headerName: "Cir Flow",
  //   field: "cirflow",
  //   flex: 1,
  // },
  {
    headerName: "업데이트 시간",
    field: "time",
    flex: 1.6,
    valueFormatter: (d: any) => dateFormat(d.data.time),
  },
];
export const PreProcessingMonthDefs: ColDef[] = [
  {
    headerName: "날짜",
    field: "time",
    flex: 1,
    valueFormatter: (d: any) => dayFormat(d.data.time),
  },
  {
    headerName: "H2SO4 Max",
    field: "maxH2so4",
    flex: 1,
  },
  {
    headerName: "H2SO4 Avg",
    field: "avgH2so4",
    flex: 1,
  },
  {
    headerName: "H2SO4 Min",
    field: "minH2so4",
    flex: 1,
  },
  {
    headerName: "H2O2 Max",
    field: "maxH2o2",
    flex: 1,
  },
  {
    headerName: "H2O2 Avg",
    field: "avgH2o2",
    flex: 1,
  },
  {
    headerName: "H2O2 Min",
    field: "minH2o2",
    flex: 1,
  },
  {
    headerName: "Cu Max",
    field: "maxCu",
    flex: 1,
  },
  {
    headerName: "Cu Avg",
    field: "avgCu",
    flex: 1,
  },
  {
    headerName: "Cu Min",
    field: "minCu",
    flex: 1,
  },
  {
    headerName: "Temp Max",
    field: "maxTemp",
    flex: 1,
  },
  {
    headerName: "Temp Avg",
    field: "avgTemp",
    flex: 1,
  },
  {
    headerName: "Temp Min",
    field: "minTemp",
    flex: 1,
  },
];
