import { ColDef } from "ag-grid-community";

export const StManagerDefs: ColDef[] = [
  {
    headerName: "공장",
    field: "facNoDescription",
    flex: 1,
  },

  {
    headerName: "공정",
    field: "roomNameDescription",
    flex: 1,
  },
  {
    headerName: "설비코드",
    field: "eqpCode",
    flex: 1,
  },
  {
    headerName: "설비이름",
    field: "eqpDescription",
    flex: 1,
  },
  {
    headerName: "설비타입",
    field: "eqpTypeDescription",
    flex: 1,
  },
  {
    headerName: "표준S/T",
    field: "defaultSt",
    flex: 1,
  },
];
