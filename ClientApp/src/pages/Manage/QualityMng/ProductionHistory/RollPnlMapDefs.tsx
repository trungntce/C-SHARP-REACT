import { useTranslation } from "react-i18next";
import { dateFormat } from "../../../../common/utility";

export const columnDefs = () =>{
  const { t } = useTranslation();
  return [  
    {
    headerName: "Roll ID",
    field: "rollId",
    flex: 1.6,
  },
  {
    headerName: "PANEL ID",
    field: "panelId",
    flex: 1.6,
  },
  {
    headerName: "Device ID",
    field: "deviceId",
    flex: 1,
  },
  {
    headerName: "BATCH NO",
    field: "workorder",
    resizable: true,
    flex: 1.6,
  },
  {
    headerName: t("@COL_OPERATION_SEQ_NO"),//"공정순서",
    field: "operSeqNo",
    resizable: true,
    flex: 0.7,
  },
  {
    headerName: t("@COL_OPERATION_CODE"),//"공정코드",
    field: "operCode",
    flex: 0.7,
  },
  {
    headerName: t("@COL_OPERATION_NAME"),//"공정명",
    field: "operationDescription",
    flex: 1.7,
  },
  {
    headerName: t("@COL_EQP_NAME"),//"설비명",
    field: "eqpName",
    flex: 1.7,
  },
  {
    headerName: t("@COL_CREATION_TIME"),//"생성시간",
    field: "createDt",
    flex: 1,
    cellRenderer: (d: any) => {
      return dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm")
    }
  },

]
};
