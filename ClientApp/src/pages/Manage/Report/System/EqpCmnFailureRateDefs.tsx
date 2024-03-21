import { currencyFormat, dateFormat, devideFormat } from "../../../../common/utility";

export const columnDefs = [
  {
    headerName: "설비코드",
    field: "eqpCode",
    maxWidth: "150",
  },
  {
    headerName: "설비명",
    field: "eqpDescription",
    maxWidth: "200",
  },
  {
    headerName: "공정명",
    field: "roomName",
    maxWidth: "200",
  },
  {
    headerName: "설비별 통신",
    children: [
      {headerName: "양호", field: "totalCnt", maxWidth: 80, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.totalCnt)},
      {headerName: "통신장애", field: "ngCnt", maxWidth: 80, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.ngCnt)},
      {headerName: "장애률", cellClass: "cell-silver cell-right", field: "ngCnt", maxWidth: 90, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data.ngCnt, d.data.totalCnt, )},
    ]
  },
]