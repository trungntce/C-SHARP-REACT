import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";

export const DefectRollDefs: ColDef[] = [
  {
    headerName: "롤 ID",
    field: "rollId",
    flex: 0.8,
  },
  {
    headerName: "결함 코드",
    field: "defectCode",
    flex: 1,
  },
  {
    headerName: "결함 등록 사유",
    field: "onRemark",
    flex: 1.5,
  },
  {
    headerName: "결함 등록 직원",
    field: "onUpdateUser",
    flex: 1,
  },
  {
    headerName: "결함 등록 시간",
    field: "onDt",
    flex: 1,
    valueFormatter: (d: any) => dateFormat(d.data.onDt),
  },
  {
    headerName: "결함 해제 사유",
    field: "offRemark",
    flex: 1.5,
  },
  {
    headerName: "결함 해제 직원",
    field: "offUpdateUser",
    flex: 1,
  },
  {
    headerName: "결함 해제 시간",
    field: "offDt",
    flex: 1,
    valueFormatter: (d: any) => dateFormat(d.data.offDt),
  },
];
