import { useTranslation } from "react-i18next"
import { currencyFormat, devideFormat, percentFormat } from "../../../common/utility"

export const TotalDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_DIVISION"),//"구분",
      field: "judgeName",
      width: 100,
      cellClass: "cell-link"
    },
    {
      headerName: t("@COL_DEFECT_QUANTITY"),//"불량수량",
      field: "judgeCnt",
      width: 90,
      type: 'rightAligned', 
      valueFormatter: (d:any) => currencyFormat(d.data.judgeCnt),
    },
    {
      headerName: t("@COL_DEFECT_RATE"),//"불량률",
      field: "ngRate",
      width: 70,
      type: 'rightAligned', 
      valueFormatter: (d:any) => ((d.data.judgeCnt / d.data.total) *100).toFixed(2) + '%',
      // valueFormatter: (d:any) => percentFormat(d.data.ngRate),
    },
  ]
}

export const NGDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: "BATCH",
      field: "workorder",
      width: 170,
      cellClass: "cell-link"
    },
    {
      headerName: "PANEL",
      field: "panelId",
      width: 220,
      cellClass: "cell-link",
      valueFormatter: (d:any) => d.data.matchPanelId || d.data.panelId,
    },
    {
      headerName: t("@COL_ITEM_NAME"),//"제품명",
      field: "itemName",
      width: 200,
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpName",
      width: 180,
    },  
  ]
}