import { ColDef } from "ag-grid-community";
import { currencyFormat, dateFormat, devideFormat } from "../../common/utility";
import { useTranslation } from "react-i18next";

export const columnDefs = () =>{
  const { t } = useTranslation();

  return [ 
    {
      headerName: "PANEL BARCODE",
      field: "panelId",
      width: 250,
    },
    {
      headerName: t("@COL_ITEM_NAME"),    //"제품명",
      field: "itemDescription",
      width: 230,
    },
    {
      headerName: t("@COL_MODEL_CODE"),    //"모델코드",
      field: "modelCode",
      width: 170,
    },
    {
      headerName: "Device ID",
      field: "deviceId",
      width: 140,
    },
    {
      headerName: t("@COL_EQP_CODE"),    //"장비코드",
      field: "eqpCode",
      width: 150,
    },
    {
      headerName: t("@COL_EQP_NAME"),    //"장비명",
      field: "eqpName",
      width: 220,
    },  
    {
      headerName: "BATCH",
      field: "workorder",
      width: 160,
    },
    {
      headerName: t("@COL_OPERATION_SEQ_NO"),    //"공정순서",
      field: "operSeqNo",
      width: 100,
    },
    {
      headerName: t("@COL_OPERATION_NAME"),    //"공정명",
      field: "operDescription",
      width: 200,
    },
    {
      headerName: t("@COL_SCAN_TIME"),    //"스캔일시",
      field: "scanDt",
      width: 150,
      cellRenderer: (d: any) => {
        return dateFormat(d.data.scanDt, "YYYY-MM-DD HH:mm:ss")
      }
    },
    {
      headerName: t("@COL_CREATION_TIME"),    //"생성시간",
      field: "createDt",
      width: 150,
      cellRenderer: (d: any) => {
        return dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm:ss")
      }
    },
  ]
}
