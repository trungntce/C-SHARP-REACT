import { ColDef } from "ag-grid-community";
import { currencyFormat, dateFormat, devideFormat, nullGuard } from "../../../common/utility";
import { useTranslation } from "react-i18next";

export const columnDetailDefs = () => {
  const { t } = useTranslation();
  return [ 
    {
      headerName: "BATCH",
      field: "workorder",
      width:100
    },
    {
      headerName: "TOOL", 
      field: "tool", 
      width:100
    },
    {
      headerName: "PANEL ID",
      field: "matchPanelId",
      width:200
    },  
    {
      headerName: t("@WORKER"), //"작업자", 
      field: "worker", 
      width:100
    },  
    {
      headerName: "PNL", 
      field: "panelSeq", 
      width:100,
      valueFormatter: (d:any) => currencyFormat(d.data.panelSeq)
    },
    {
      headerName: "PCS", 
      field: "pieceNo", 
      width:100,
      valueFormatter: (d:any) => currencyFormat(d.data.pieceNo)
    },
    {
      headerName: t("@COL_RESULT"), //"결과", 
      field: "lslUslJudge", 
      width:100
    },
    {
      headerName: "A-Pin", 
      field: "pinA", 
      width:80
    },
    {
      headerName: "B-Pin", 
      field: "pinB", 
      width:80
    },
    {
      headerName: "LSL", 
      field: "lsl", 
      width:80,
      type: 'rightAligned', 
    },
    {
      headerName: "USL", 
      field: "usl", 
      width:80,
      type: 'rightAligned', 
    },
    {
      headerName: t("@MEASURED_VALUE"), //"측정값", 
      field: "inspVal", 
      width:100,
      type: 'rightAligned', 
    },
  ]
}