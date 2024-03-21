import { useTranslation } from "react-i18next";
import { dateFormat, getLang, getLangAll } from "../../../../common/utility";

export const job4mMapDefs = () =>{
  const { t } = useTranslation();

  return [
    {
      headerName: `${t("@COL_MODEL_CODE")}(MES)`, //"모델코드(MES)",
      field: "modelMes",
      minWidth: 110,
    },
    {
      headerName: `${t("@COL_MODEL_CODE")}(ERP)`, //"모델코드(ERP)",
      field: "modelErp",
      minWidth: 110,
    },
    {
      headerName: t("@COL_MODEL_NAME"), //"모델명",
      field: "bomItemDescription",
      minWidth: 180,
    },
    {
      field: "itemCode",
      headerName: t("@COL_ITEM_CODE"), //"제품코드",
      width: 150,     
    },
    {
      field: "itemName",
      headerName: t("@COL_ITEM_NAME"), //"제품명",
      width: 190,     
    },
    {
      headerName: t("@COL_OPERATION_SEQ_NO"), //"공정순서",
      field: "operationSeqNo",
      maxWidth: 80,
    },
    // {
    //   headerName: t("@COL_OPERATION_NAME"), //"공정명",
    //   field: "operationDescription",
    //   minWidth: 180,
    // },
    {
      headerName: t("@COL_OPERATION_NAME"), //"공정명",
      field: "tranOperName",
      minWidth: 350,
      valueFormatter: (d: any) => getLang(d.data.tranOperName),
    },
    {
      headerName: t("@COL_WORKCENTER_NAME"), //"작업장명",
      field: "workcenterDescription",
      minWidth: 180,
    },
    {
      headerName: t("@COL_EQP_CODE"), //"설비코드",
      field: "equipmentCode",
      minWidth: 130,
    },
    {
      headerName: t("@COL_EQP_NAME"), //"설비명",
      field: "equipmentDescription",
      minWidth: 180,
    },
    {
      headerName: "BATCH NO",
      field: "jobNo",
      minWidth: 200,
    },
    {
      headerName: t("@COUNT"), //"LOT 수량",
      field: "qty",
      maxWidth: 80,
    },
    {
      headerName: "4M NG",
      field: "ngJudge",
      maxWidth: 90,
    },
    {
      headerName: `4M ${t("@START_TIME")}`, //"4M 시작 시간",
      field: "startDt",
      maxWidth: 140,
      valueFormatter: (d: any) => dateFormat(d.data.startDt, "YYYY-MM-DD HH:mm"),
    },
    {
      headerName: `4M ${t("@END_TIME")}`, //"4M 종료 시간",
      field: "endDt",
      maxWidth: 140,
      valueFormatter: (d: any) => dateFormat(d.data.endDt, "YYYY-MM-DD HH:mm"),
    },
    {
      headerName: t("@WORKER_CODE"), //"작업자 코드",
      field: "workerCode",
      minWidth: 80,
    },
    {
      headerName: t("@WORKER_NAME"), //"작업자명",
      field: "workerName",
      minWidth: 100,
    },
    {
      headerName: t("@MSG"), //"4M 메세지",
      field: "4MMsg",
      width: 200,
    },
    // {
    //   headerName: "ERP 시작 시간",
    //   field: "lotCreateDate",
    //   maxWidth: 140,
    //   valueFormatter: (d: any) => dateFormat(d.data.lotCreateDate, "YYYY-MM-DD HH:mm"),
    // },
    // {
    //   headerName: "ERP 종료 시간",
    //   field: "lotEndDate",
    //   maxWidth: 140,
    //   valueFormatter: (d: any) => dateFormat(d.data.lotEndDate, "YYYY-MM-DD HH:mm"),
    // },
    // {
    //   headerName: "시작 시간차",
    //   field: "startToMesMin",
    //   maxWidth: 100,
    // },
    // {
    //   headerName: "종료 시간차",
    //   field: "endToMesMax",
    //   maxWidth: 100,
    // },
  ]
};
