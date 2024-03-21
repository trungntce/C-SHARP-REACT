import { ColDef } from "ag-grid-community";
import { toComma } from "../../AnyPage/utills/toComma";

export const GirdDefs: ColDef[] = [
  {
    field: "type_des",
    flex: 2,
    headerComponentParams: {
      template: '<div class="header-wrapper">설비유형</div>',
    },
    suppressMovable: true,
    cellStyle: { fontSize: "19px", fontWeight: "bold" },
  },
  {
    field: "eqp_total",
    flex: 1,
    headerComponentParams: {
      template: '<div class="header-wrapper"><div>전체설비</div>',
    },
    suppressMovable: true,
    cellStyle: { fontSize: "19px", fontWeight: "bold" },
  },
  {
    field: "run_eqp",
    flex: 1,
    headerComponentParams: {
      template: '<div class="header-wrapper"><div>연결설비</div>',
    },
    suppressMovable: true,
    cellStyle: { fontSize: "19px", fontWeight: "bold" },
  },
  {
    field: "total_prod",
    flex: 1,
    headerComponentParams: {
      template: '<div class="header-wrapper"><div>생산실적</div>',
    },
    suppressMovable: true,
    valueFormatter: ({ value }: any) =>
      `${value ? toComma(value) + " PNL" : "-"}`,
    cellStyle: { fontSize: "19px", fontWeight: "bold" },
  },
  {
    field: "avg_time_rate",
    flex: 1.1,
    headerComponentParams: {
      template: '<div class="header-wrapper"><div>시간가동률</div>',
    },
    suppressMovable: true,
    valueFormatter: ({ value }: any) =>
      `${value ? value.toFixed(0) + "%" : "-"}`,
    cellStyle: { fontSize: "19px", fontWeight: "bold" },
  },
  {
    //임시
    field: "avg_oee_rate_imsi",
    flex: 1,
    headerComponentParams: {
      template: '<div class="header-wrapper">OEE</div>',
    },
    suppressMovable: true,
    //cellRenderer: CellRanderTest,
    valueFormatter: ({ value }: any) =>
      `${value ? value.toFixed(1) + "%" : "-"}`,
    cellStyle: { fontSize: "19px", fontWeight: "bold" },
  },
  // {
  //   field: "operationYn",
  //   flex: 1,
  //   headerComponentParams: {
  //     template: '<div class="header-wrapper">가동상태</div>',
  //   },
  //   suppressMovable: true,
  //   valueFormatter: ({ value }: any) => {
  //     if (value === 1) {
  //       return "가동중";
  //     } else if (value === 0) {
  //       return "비가동중";
  //     } else if (value === -1) {
  //       return "설비이상";
  //     } else if (value === -2) {
  //       return "설비고장";
  //     }
  //     return "";
  //   },
  //   cellStyle: ({ value }: any) => {
  //     if (value === 1) {
  //       return { color: "#54e346" };
  //     } else if (value === 0) {
  //       return { color: "#94DAFF" };
  //     } else if (value === -1) {
  //       return { color: "#FF1700" };
  //     } else if (value === -2) {
  //       return { color: "#808080" };
  //     }
  //     return null;
  //   },
  // },
];
