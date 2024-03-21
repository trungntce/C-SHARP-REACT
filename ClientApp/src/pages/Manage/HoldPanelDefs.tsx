import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";

export const HoldPanelDefs: ColDef[] = [
  {
    headerName: "판넬 ID",
    field: "panelId",
    flex: 0.8,
  },
  {
    headerName: "보류 요청 사유",
    field: "onRemark",
    flex: 1.5,
  },
  {
    headerName: "보류 코드",
    field: "holdCode",
    flex: 1,
  },
  {
    headerName: "보류 요청 직원",
    field: "onUpdateUser",
    flex: 1,
  },
  {
    headerName: "보류 요청 시간",
    field: "onDt",
    flex: 1,
    valueFormatter: (d: any) => dateFormat(d.data.onDt),
  },
  {
    headerName: "보류 해제 사유",
    field: "offRemark",
    flex: 1.5,
  },
  {
    headerName: "보류 해제 직원",
    field: "offUpdateUser",
    flex: 1,
  },
  {
    headerName: "보류 해제 시간",
    field: "offDt",
    flex: 1,
    valueFormatter: (d: any) => dateFormat(d.data.offDt),
  },
];
