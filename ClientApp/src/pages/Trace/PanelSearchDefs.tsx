import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../common/utility";

export const panelSearchDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@COL_VENDOR_NAME"), //"고객사",
      field: "vendorShortName",
      width: 150,
    },
    {
      headerName: t("@COL_ITEM_NAME"), //"제품명",
      field: "itemDescription",
      width: 230,
    },
    {
      headerName: t("@COL_MODEL_CODE"), //"모델코드",
      field: "modelCode",
      width: 210,
    },
    {
      headerName: "BATCH",
      field: "workorder",
      width: 220,
    },
    {
      headerName: "PNL QTY(고속스캔)",
      field: "panelCnt",
      width: 150,
    },
  ];
}
