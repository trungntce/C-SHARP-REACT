import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";

export const InterlockHistoryRollPanelDefs: ColDef[] = [
  {
    headerName: "롤 ID",
    field: "parentRoll",
    flex: 1.2,
    headerCheckboxSelection: true,
    checkboxSelection: true,
  },
  {
    headerName: "판넬 ID",
    field: "childPanel",
    flex: 1,
  },
  {
    headerName: "등록 시간",
    field: "createDt",
    flex: 1.5,
    valueFormatter: (d: any) => dateFormat(d.data.createDt),
  },
];
