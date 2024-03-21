import { ColDef } from "ag-grid-community";
import { dateFormat, getLang, getLangAll } from "../../common/utility";
import { useTranslation } from "react-i18next";

export const DefectPanelDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_BASIC_INFORMATION"), //"기본정보",
      headerClass: "no-leftborder",
      children: [
        {
          headerName: "Roll ID",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          field: "rollId",
          width: 150,
          tooltipValueGetter: (d:any) => d.data.parentRollId,
        },
        {
          headerName: "PNL ID",
          field: "panelId",
          width: 200,
        },
        {
          headerName: "BATCH No",
          field: "workorder",
          width: 180,
        },
        {
          field: "operSeqNo",
          headerName: t("@OPER_SEQ"), //"공순",
          width: 55,
          tooltipValueGetter: (d:any) => `[${d.data.operSeqNo}] ${d.data.operCode}`,
        },
        // {
        //   field: "operName",
        //   headerName: t("@COL_OPERATION_NAME"), //"공정명",
        //   width: 150,
        //   tooltipValueGetter: (d:any) => d.data.operName,
        // },
        {
          field: "tranOperName",
          headerName: t("@COL_OPERATION_NAME"), //"공정명",
          width: 150,
          tooltipValueGetter: (d:any) => getLang(d.data.tranOperName),
          valueFormatter: (d: any) => getLang(d.data.tranOperName),
        },
      ],
    },
    {
      headerName: t("@COL_DEFECT_REGISTRATION"), //"불량 등록",
      headerClass: "real-leftborder",
      children: [
        {
          headerName: t("@COL_DEFECT_CODE"), //"불량 코드",
          field: "defectName",
          width: "120",
        },
        {
          headerName: t("@COL_PROCESSING_METHOD"), //"처리방법",
          field: "judgeMethod",
          width: "120",
          tooltipValueGetter: (d:any) => d.data.judgeMethod,
        },
        {
          headerName: t("@COL_REASON"), //"사유",
          field: "onRemark",
          width: "120",
        },
        {
          headerName: t("@COL_AUTO"), //"자동",
          field: "autoYn",
          width: "40",
          filter: false,
          tooltipValueGetter: (d:any) => d.data.autoYn,
        },
        {
          headerName: t("@COL_OPERATION_PERSONINCHARGE_NAME"), //"공정 담당자",
          field: "judgeUserName",
          width: "120",
        },
        {
          headerName: t("@REGISTRATION_OFFICER"), //"등록 담당자",
          field: "onUserName",
          width: "120",
        },
        {
          headerName: t("@COL_REGISTRATION_DATE"), //"등록일",
          field: "onDt",
          width: "130",
          valueFormatter: (d: any) => dateFormat(d.data.onDt),
        },
      ]
    },
    {
      headerName: t("@DEFECT_RELEASE"), //"불량 해제",
      headerClass: "real-leftborder",
      children: [
        {
          headerName: t("@COL_RELEASING_REASON"), //"해제 사유",
          field: "offRemark",
          width: "150",
        },
        {
          headerName: t("@RELEASE_OFFICER"), //"해제 담당자",
          field: "offUserName",
          width: "120",
        },
        {
          headerName: t("@RELEASE_DATE"), //"해제 시간",
          field: "offDt",
          width: "130",
          valueFormatter: (d: any) => dateFormat(d.data.offDt),
        },
      ]
    }
  ]
};
