import { useTranslation } from "react-i18next";

export const columnGroupProdDefs = () => {
  const { t }  = useTranslation();


  return [
    {
      headerName: "No",
      valueGetter: "node.rowIndex + 1",
      width:40,
      filter: false,
      cellStyle: {
        textAlign: 'center'
      }
    },
    {
      headerName: "작업장코드",
      field: "workcenterCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "작업장",
      field: "workcenterDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "유형",
      field: "groupType",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
    {
      headerName: "관리코드",
      field: "checksheetGroupCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "관리명",
      field: "checksheetGroupName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: "설명",
      field: "remark",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@USEYN"),
      field: "useYn",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1,
    },
  ];
}
