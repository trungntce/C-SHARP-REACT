import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";

export const InterlockRollDefs = [
  {
    headerName: "롤 ID",
    field: "rollId",
    flex: 0.8,
  },
  {
    headerName: "인터락 ON",
    children: [
      {
        headerName: "인터락 ON 사유",
        headerClass: "real-leftborder",
        field: "onRemark",
        flex: 1.5,
      },
      {
        headerName: "인터락 코드",
        field: "interlockCode",
        flex: 1,
      },
      {
        headerName: "인터락 ON 직원",
        field: "onUpdateUser",
        flex: 1,
      },
      {
        headerName: "등록 시간",
        field: "onDt",
        
        flex: 1,
        valueFormatter: (d: any) => dateFormat(d.data.onDt),
      },
    ]
  },
  {
    headerName: "인터락 OFF",
    children: [
      {
        headerName: "인터락 OFF 사유",
        headerClass: "real-leftborder",
        field: "offRemark",
        flex: 1.5,
      },
      {
        headerName: "인터락 OFF 직원",
        field: "offUpdateUser",
        flex: 1,
      },
      {
        headerName: "해제 시간",
        field: "offDt",
        flex: 1,
        valueFormatter: (d: any) => dateFormat(d.data.offDt),
      },
    ]
  }
];
