import { dateFormat } from "../../../common/utility";
const devideFormat = (a?: number, b?: number) => { 
  if (a === undefined || b === undefined || a === null || b === null) return '';
  if (a === 0 && b === 0) { 
    return '';
  }
  if (b === 0) return '';
  return ((a * 100) / b).toFixed(2) + '%';
}

export const bbtWorstDefs = [
  {
    headerName: "등급",
    field: "grade",
    width: 60,
    resizable: true,
    filter: true
  },
  {
    headerName: "MODEL CODE",
    field: "modelCode",
    width: 170,
    resizable: true,
    filter: true,
  },
  {
    headerName: "MODEL NAME",
    field: "modelName",
    width: 170,
    resizable: true,
    filter: true,
  },
  {
    field: "operName",
    headerName: "공정명",
    width: 70,
    resizable: true,
    suppressMovable: true,
    filter: true,
  },
  {
    field: "stdDefectRate",
    headerName: "기준불량율",
    width: 80,
    resizable: true,
    filter: true,
  },
  {
    field: "defectToday",
    headerName: "현재불량율",
    width: 80,
    resizable: true,
    cellStyle:(params: any) => {
      return {borderRight: "1px solid white"}
    },
    suppressMovable: true,
    cellRenderer: (value: any) => devideFormat(value.data?.defectToday, value.data?.pcsToday),
  },
  {
    field: "defectYesterday",
    headerName: "전일불량율",
    width: 80,
    resizable: true,
    suppressMovable: true,
    cellRenderer: (value: any) => devideFormat(value.data?.defectYesterday, value.data?.pcsYesterday),
  },
  {
    field: "defectWeek",
    headerName: "주간불량율",
    width: 80,
    resizable: true,
    suppressMovable: true,
    cellRenderer: (value : any) => devideFormat(value.data?.defectWeek, value.data?.pcsWeek),
  },
  {
    field: "defectMonth",
    headerName: "월간불량율",
    width: 80,
    resizable: true,
    suppressMovable: true,
    cellRenderer: (value : any) => devideFormat(value.data?.defectMonth, value?.data.pcsMonth),
  },
];


export const bbtEqpWorstDefs = [
  {
    headerName: "검사일자",
    field: "mesDate",
    width: 60,
    resizable: true,
    filter: true,
    cellRenderer: (d: any) => {
      return dateFormat(d.data.mesDate, "MM월 DD일")
    }
  },
  {
    headerName: "설비명",
    field: "eqpName",
    cellClass: "cell-link",
    width: 150,
    resizable: true,
  },
  {
    headerName: "작업설비 명",
    field: "eqpCode",
    width: 150,
    resizable: true,
  },
  {
    headerName: "PNL수량",
    field: "panelQty",
    width: 90,
    resizable: true,
  },
  {
    headerName: "항목",
    field: "ngName",
    width: 90,
    resizable: true,
  },
  {
    headerName: "불량률",
    field: "ngCnt",
    width: 90,
    resizable: true,
    valueFormatter: (d: any) => devideFormat(d.data.ngCnt, d.data.pcsTotal),
  }
];

export const bbtDetailEqpWorstDefs = [
  {
    headerName: "검사일자",
    field: "mesDate",
    width: 60,
    resizable: true,
    filter: true,
    cellRenderer: (d: any) => { return dateFormat(d.data.mesDate, "YYYY-MM-DD HH:MM:SS") }
  },
  {
    headerName: "작업설비 명",
    field: "eqpCode",
    width: 150,
    resizable: true,
  },
  {
    headerName: "Batch No",
    field: "workorder",
    width: 150,
    resizable: true,
  },
  {
    headerName: "PNL No",
    field: "panelId",
    width: 90,
    resizable: true,
  },
  {
    headerName: "검사 증",
    field: "ngName",
    width: 90,
    resizable: true,
  },
  {
    headerName: "PNL 불량률",
    field: "ngCnt",
    width: 90,
    resizable: true,
    cellRenderer: (d: any) => {
      if (d.data.ngPcsCnt === null || d.data.pcsTotal === null) {
        return '';
      }
      if (d.data.ngPcsCnt === 0 || d.data.pcsTotal === 0) {
        return '';
      }
      const ng = ((d.data.ngPcsCnt / d.data.pcsTotal) * 100).toFixed(2);

      if (d.data.stdDefectRate != undefined && d.data.stdDefectRate != null && ng > d.data.stdDefectRate) { 
        return <span className="badge bg-danger cell-ctq">{ng}%</span>;
      }
      return ng + '%';
    }
  }
];
