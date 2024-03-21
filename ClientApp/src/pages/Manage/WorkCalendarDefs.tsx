import {  dateFormat } from "../../common/utility";

export const columnDefs = [
    {
      headerName: "작업일",
      field: "workDate",
      filter: "agTextColumnFilter",
      headerClass: "no-leftborder",
      maxWidth: 180,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.workDate)
          return 0
  
        return dateFormat(d.data.workDate, "YYYY-MM-DD")
      }
    },
    {
      headerName: "작업자명",
      field: "workerName",
      flex: 1,
    },
    {
      headerName: "휴게일",
      field: "offDate",
      headerClass: "no-leftborder",
      maxWidth: 180,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.offDate)
          return 0
  
        return dateFormat(d.data.offDate, "YYYY-MM-DD")
      }
    },
    {
      headerName: "작업유무",
      field: "workYn",
      flex: 0.5,
    },
    // {
    //   headerName: "주/야간",
    //   field: "shiftType",
    //   flex: 0.5,
    // },
    {
      headerName: "비고",
      field: "remark",
      flex: 2,
    },
    {
      headerName: "생성시간",
      field: "createDt",
      flex: 1,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.createDt)
          return 0
  
        return dateFormat(d.data.createDt, "YYYY-MM-DD MM:DD:MS")
      }
    },
];