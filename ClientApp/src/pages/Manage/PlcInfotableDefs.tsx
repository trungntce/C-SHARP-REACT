import moment from 'moment';
import { dateFormat } from '../../common/utility';

export const columnDefs: any = () => {
  return [
    {
      headerName: "일시",
      field: "inserttime",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.inserttime, "YYYY-MM-DD HH:mm:ss")
    },
    {
      headerName: "생산량",
      field: "count",
      maxWidth: 80,
      filter: "agNumberColumnFilter",
    },
    {
      headerName: "시작시간",
      field: "starttime",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.starttime, "YYYY-MM-DD HH:mm:ss")
    },
    {
      headerName: "이전종료시간",
      field: "prevEndtime",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.prevEndtime, "YYYY-MM-DD HH:mm:ss")
    },
    {
      headerName: "종료시간",
      field: "endtime",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.endtime, "YYYY-MM-DD HH:mm:ss")
    },
    {
      headerName: "생산시간(초)",
      field: "endtimeDiff",
      maxWidth: 120,
    },    
    {
      headerClass: "",
      headerName: "장비상태",
      field: "eqstatus",
      maxWidth: 80,
    },
  ];
}