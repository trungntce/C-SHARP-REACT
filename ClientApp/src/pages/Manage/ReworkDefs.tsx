  import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";
import { useTranslation } from "react-i18next";

export const ReworkDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: `${t("@COL_REWORK")} Code`,//"재처리 Code",
      field: "codeId",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: `${t("@COL_REWORK")} Name`,//"재처리 Name",
      field: "codeName",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: t("@REMARK"),//"설명",
      field: "remark",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: t("@USEYN"),//"사용여부",
      field: "useYn",
      cellStyle: {textAlign: 'center'},
      flex: 0.5,
    },
    {
      headerName: t("@COL_CREATE_USER"),//"생성자",
      field: "createUser",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: t("@COL_CREATION_TIME"),//"생성시간",
      field: "createDt",
      flex: 1.3,
      cellStyle: {textAlign: 'center'},
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    },
    {
      headerName: t("@COL_UPDATE_USER"),//"변경자",
      field: "updateUser",
      cellStyle: {textAlign: 'center'},
      flex: 1,
    },
    {
      headerName: t("@COL_UPDATE_TIME"),//"변경시간",
      field: "updateDt",
      cellStyle: {textAlign: 'center'},
      flex: 1.3,
      valueFormatter: (d: any) => dateFormat(d.data.updateDt),
    },
  ];
} 
