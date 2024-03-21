import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";
import { useTranslation } from "react-i18next";

export const columnDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@LANG_CODE"), //"다국어코드",
      field: "langCode",
      flex: 2,
    },
    {
      headerName: t("@COUNTRY_CODE"), //"국가코드",
      field: "nationCode",
      flex: 1,
    },
    {
      headerName: `${t("@LANG")}Text`, //"다국어Text",
      field: "langText",
      flex: 4,
    },
    {
      headerName: t("@COL_CREATE_USER"), //"생성자",
      field: "createUser",
      flex: 0.7,
    },
    {
      headerName: t("@COL_CREATION_TIME"), //"생성날짜",
      field: "createDt",
      flex: 1,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    },
    {
      headerName: t("@COL_UPDATE_USER"), //"변경자",
      field: "updateUser",
      flex: 0.7,
    },
    {
      headerName: t("@COL_UPDATE_TIME"), //"변경시간",
      field: "updateDt",
      flex: 1,
      valueFormatter: (d: any) => dateFormat(d.data.updateDt)
    },
  ]
} ;
