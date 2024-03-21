import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../common/utility";

export const panelItemDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@COL_PANEL_BARCODE"),  //"판넬바코드",
      field: "panelId",
      flex: 1.4
    },
    {
      headerName: t("@COL_CREATION_TIME"),  //"생성시간",
      field: "createDt",
      filter: "agDateColumnFilter",
      flex: 0.8,
      valueFormatter: (d: any) => dateFormat(d.data.createDt)
    }

  ];
}
