import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../../common/utility";
import { TimeFormat } from "../../AnyPage/utills/getTimes";

export const waterColumnDefs: ColDef[] = [
  {
    headerName: "모델명",
    field: "eqcode",
    width: 120,
    resizable: true,
  },
  {
    headerName: "저항값",
    field: "d006",
    width: 120,
    resizable: true,
  },
  {
    headerName: "NG 발생 시작 ~ 종료",
    field: "time",
    width: 300,
    resizable: true,
  },
  {
    headerName: "조치사항",
    field: "insertRemark",
    flex: 1,
    editable: true,
  },
];
export const takeactionDefs: ColDef[] = [
  {
    headerName: "모델명",
    field: "eqpCode",
    width: 120,
    resizable: true,
  },
  {
    headerName: "NG 발생 시작 ~ 종료",
    field: "time",
    valueFormatter: (d: any) =>
      `${TimeFormat(d.data.startDt)} ~ ${TimeFormat(d.data.endDt)}`,
    width: 300,
    resizable: true,
  },
  {
    headerName: "조치사항",
    field: "insertRemark",
    width: 500,
    flex: 1,
    editable: true,
  },
  {
    headerName: "업데이트 시간",
    field: "insertDt",
    width: 300,
    flex: 1,
    editable: true,
    valueFormatter: (d: any) => TimeFormat(d.data.insertDt),
  },
];
