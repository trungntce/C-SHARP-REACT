import { useTranslation } from "react-i18next";

export const columnDefs = () =>{
  const { t } = useTranslation();

  return  [
    {
      headerName: t("@SORT"), //순서
      field: "operSeqNo",
      flex: 1,
    },
    {
      headerName: t("@COL_PROCESS_GROUP_NAME"), //공정그룹명
      field: "operGroupName",
      flex: 1,
    },
    {
      headerName:t("@COl_INTERNAL_CAPA"), // "사내 CAPA"
      field: "inCapaVal",
      flex: 1,
    },
    {
      headerName:t("@COL_UNIT"), // "단위"
      field: "unit",
      flex: 1,
    },
    {
      headerName:t("@COL_DIVISION"), // "구분"
      field: "gubun",
      flex: 1,
    },
  ]
};