import { useTranslation } from "react-i18next";

export const columnEqpDefs = () => {
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
      headerName: t("@EQP_CODE"),
      field: "eqpCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@COL_EQP_NAME"),
      field: "equipmentDescription",
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
