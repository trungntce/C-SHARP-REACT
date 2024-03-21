import { useTranslation } from "react-i18next";

export const columnDefs = () => {
  const { t } = useTranslation();

  return [
    {
      headerName: `${t("@WORKER")} ID`, // "작업자ID",
      field: "workerId",
      filter: "agTextColumnFilter",
      sortable: true,
    },
    {
      headerName: t("@WORKER_NAME"), // "작업자명",
      field: "workerName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: `${t("@COL_BARCDOE")} ID`, // "바코드ID",
      field: "rowKey",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@COL_CREATE_USER"), // "생성자",
      field: "createUser",
      flex: 1,
    },
    {
      headerName: t("@COL_CREATION_TIME"), // "생성날짜",
      field: "createDt",
      flex: 1,
    },
    {
      headerName: t("@COL_UPDATE_USER"), // "변경자",
      field: "updateUser",
      flex: 1,
    },
    {
      headerName: t("@COL_UPDATE_TIME"), // "변경시간",
      field: "updateDt",
      flex: 1,
    },
  
  ]
};