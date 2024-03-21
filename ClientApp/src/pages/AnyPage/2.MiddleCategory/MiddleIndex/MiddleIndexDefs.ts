import { ColDef } from "ag-grid-community";
import { toComma } from "../../utills/toComma";
import CellRanderTest from "../Components/OeeCellComponents";
import TypeMoveBtn from "./TypeMoveBtn";

export const MiddleIndexDefs: ColDef[] = [
  {
    field: "type_des",
    flex: 1.2,
    headerComponentParams: {
      template: '<div class="header-wrapper">설비유형</div>',
    },
    suppressMovable: true,
    cellStyle: { fontSize: "19px", fontWeight: "bold" },
  },
  {
    field: "eqp_total",
    flex: 0.5,
    headerComponentParams: {
      template: '<div class="header-wrapper"><div>전체설비</div>',
    },
    suppressMovable: true,
    cellStyle: { fontSize: "19px", fontWeight: "bold" },
  },
  {
    field: "run_eqp",
    flex: 0.5,
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
    flex: 1,
    headerComponentParams: {
      template: '<div class="header-wrapper"><div>시간가동률</div>',
    },
    suppressMovable: true,
    valueFormatter: ({ value }: any) =>
      `${value ? value.toFixed(0) + " %" : "-"}`,
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
];
