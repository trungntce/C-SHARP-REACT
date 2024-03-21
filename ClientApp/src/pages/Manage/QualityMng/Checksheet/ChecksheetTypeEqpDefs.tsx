import { useTranslation } from "react-i18next";
import { dateFormat } from '../../../../common/utility';

export const columnTypeEqpDefs = () => {
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
      headerName: t("@CKSCODE"),
      field: "checksheetCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: t("@WCCODE"),
      field: "workcenterCode",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@WCNAME"),
      field: "workcenterDescription",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 2,
    },
    {
      headerName: t("@CKSGNAME"),
      field: "checksheetGroupName",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
    },
    {
      headerName: t("@REV"),
      field: "rev",
      filter: "agTextColumnFilter",
      sortable: true,
      flex: 1.5,
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
