import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";
import { useTranslation } from "react-i18next";

export const columnDefs = () => {
  const {t} = useTranslation();
  return [
    {
      headerName: "No",
      field: "noticeNo",
      flex: 1,
    },
    {
      headerName: t("@USEYN") ,//사용여부",
      field: "useYn",
      flex: 1,
    },
    {
      headerName: t("@TITLE"), //"타이틀",
      field: "title",
      flex: 1,
    },
    {
      headerName: t("@CONTENT"), //"내용",
      field: "body",
      flex: 1,
    },
    {
      headerName: t("@START_DATE"), //"시작날짜",
      field: "startDt",
      flex: 1,
    },
    {
      headerName: t("@LAST_DATE"), //"마지막날짜",
      field: "endDt",
      flex: 1,
    },
    {
      headerName: t("@COL_CREATE_USER"),//"생성자",
      field: "createUser",
      flex: 1,
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"생성시간",
      field: "createDt",
      flex: 1,
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    },
    {
      headerName: t("@COL_UPDATE_USER"),//변경자",
      field: "updateUser",
      flex: 1,
    },
    {
      headerName: t("@COL_UPDATE_TIME"), //변경시간",
      field: "updateDt",
      flex: 1,
      valueFormatter: (d: any) => dateFormat(d.data.updateDt),
    },
  ];
}