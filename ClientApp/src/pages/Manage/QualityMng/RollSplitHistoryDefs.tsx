import { useTranslation } from "react-i18next";
import { dateFormat } from "../../../common/utility";


export const rollDefs = () => [
  {
    field: "childId",
    headerName: "Roll",
    flex: 1,
  }
];



export const splitRollDefs = () => {
  const { t } =  useTranslation()
  return [
    {
      field: "childId",
      headerName: "Roll ID",
      maxWidth: 250,
    },
    {
      field: "parentId",
      headerName: "Parent Roll",
      maxWidth: 250,
    },
    {
      field: "workorder",
      headerName: "BATCH",
      maxWidth: 250,
    },
    {
      field: "defectName",
      headerName: t("@COL_DEFECT_NAME"),//"불량명",
      maxWidth: 120,
    },
    {
      field: "workerName",
      headerName: t("@WORKER"),//"작업자",
      width: 120,
    },
    {
      field: "reason",
      headerName: t("@COL_DIVISION_REASON"),//"분할사유",
      width: 100,
    },
    {
      field: "createDt",
      headerName: t("@COL_DIVISION_WHEN"),//"분할시기",
      width: 140,
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    },
  ];
}








export const rollSplitPanelDefs = () => {
  const { t } = useTranslation();
  return [
    {
      field: "rollId",
      headerName: "Roll ID",
      maxWidth: 250,
    },
    {
      field: "panelId",
      headerName: "Panel ID",
      maxWidth: 250,
    },
    {
      field: "deviceId",
      headerName: "Device ID",
      maxWidth: 120,
    },
    {
      field: "workorder",
      headerName: "BATCH",
      maxWidth: 220,
    },
    {
      field: "operSeqNo",
      headerName: t("@COL_OPERATION_SEQ_NO"),//"공정순서",
      maxWidth: 80,
    },
  ];
}