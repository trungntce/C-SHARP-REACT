import { ColDef } from "ag-grid-community";
import { currencyFormat, dateFormat, devideFormat } from "../../../common/utility";

export const columnDefs = [ 
  {
    headerName: "일자",
    field: "mesDate",
    maxWidth: 100,
    headerClass: "no-leftborder",
    cellRenderer: (d: any) => {
      return dateFormat(d.data.mesDate, "YYYY-MM-DD")
    }
  },
  {
    headerName: "고객사",
    field: "vendorName",
    maxWidth: 200
  },
  {
    headerName: "제품코드",
    field: "itemCode",
    maxWidth: 250
  },
  {
    headerName: "제품명",
    field: "itemName",
    minWidth: 350
  },
  {
    headerName: "BATCH",
    field: "workorder",
    maxWidth: 300
  },
  {
    headerName: "PNL", 
    field: "panelSeq", 
    maxWidth: 60,
    valueFormatter: (d:any) => currencyFormat(d.data.panelSeq)
  },
  {
    headerName: "PCS", 
    field: "pieceNo", 
    maxWidth: 60,
    valueFormatter: (d:any) => currencyFormat(d.data.pieceNo)
  },
  {
    headerName: "결과", 
    field: "judge", 
    maxWidth: 100,
  },
  {
    headerName: "판정", 
    field: "ngJudge", 
    maxWidth: 100,
  },
  {
    headerName: "Pin A", 
    field: "pinA", 
    maxWidth: 80,
  },
  {
    headerName: "Pin B", 
    field: "pinB", 
    maxWidth: 80,
  },
  {
    headerName: "LSL", 
    field: "lsl", 
    maxWidth: 120,
    type: 'rightAligned', 
  },
  {
    headerName: "USL", 
    field: "usl", 
    maxWidth: 120,
    type: 'rightAligned', 
  },
  {
    headerName: "측정값", 
    field: "inspVal", 
    maxWidth: 120,
    type: 'rightAligned', 
  },
]