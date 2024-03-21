import { ColDef } from "ag-grid-community";
import { dateFormat, getLang, getLangAll } from "../../common/utility";
import { useTranslation } from "react-i18next";

export const ReworkPanelDefs = () => {
    const { t } = useTranslation();
    return [
        {
            //headerName: "기본정보",
            headerName: t("@COL_BASIC_INFORMATION"),
            headerClass: "no-leftborder",
            children: [
                {
                    //headerName: "롤 ID",
                    headerName: `${t("@ROLL")} ID`,
                    headerCheckboxSelection: true,
                    checkboxSelection: true,
                    field: "rollId",
                    //flex: 2,
                    width: 150,
                    tooltipValueGetter: (d: any) => d.data.rollId,
                },
                {
                    //headerName: "판넬 ID",
                    headerName: `${t("@PANEL")} ID`,
                    field: "panelId",
                    //flex: 2,
                    width: 200,
                    tooltipValueGetter: (d: any) => d.data.panelId,
                },
                {
                    headerName: "BATCH No",
                    field: "workorder",
                    width: 180,
                },
                {
                    field: "operSeqNo",
                    //headerName: "공순",
                    headerName: t("@OPER_SEQ"),
                    width: 80,
                    tooltipValueGetter: (d: any) => `[${d.data.operSeqNo}] ${d.data.operCode}`,
                },
                // {
                //     field: "operName",
                //     //headerName: "공정명",
                //     headerName: t("@COL_OPERATION_NAME"),
                //     width: 300,
                //     tooltipValueGetter: (d: any) => d.data.operName,
                // },
                {
                    field: "tranOperName",
                    //headerName: "공정명",
                    headerName: t("@COL_OPERATION_NAME"),
                    width: 300,
                    tooltipValueGetter: (d: any) => getLang(d.data.tranOperName),
                    valueFormatter: (d: any) => getLang(d.data.tranOperName),
                },
            ],
        },
        {
            //headerName: "상태",
            headerName: t("@STATE"),
            headerClass: "real-leftborder",
            children: [
                {
                    //headerName: "승인여부",
                    headerName: t("@APPROVAL_STATUS"),
                    field: "reworkApproveYn",
                    width: 90,
                    filter: false,
                    valueFormatter: (d: any) => {
                        if (d.data.approveDt)
                            return "승인"

                        if (d.data.refuseDt)
                            return "반려"

                        return "요청"
                    },
                },
            ],
        },
        {
            //headerName: "재처리 요청",
            headerName: t("@COL_REWORK_REQUEST"),
            children: [
                {
                    //headerName: "재처리 코드",
                    headerName: t("@REWORK_CODE"),
                    field: "reworkName",
                    //flex: 1,
                    width: 130,
                    tooltipValueGetter: (d: any) => d.data.reworkCode,
                },
                {
                    //headerName: "처리방법",
                    headerName: t("@COL_PROCESSING_METHOD"),
                    field: "judgeMethod",
                    width: "120",
                    tooltipValueGetter: (d: any) => d.data.judgeMethod,
                },
                {
                    //headerName: "사유",
                    headerName: t("@REASON"),
                    field: "putRemark",
                    //flex: 1.5,
                    width: 120,
                    tooltipValueGetter: (d: any) => d.data.putRemark,
                },
                {
                    //headerName: "공정 담당자",
                    headerName: t("@COL_OPERATION_PERSONINCHARGE_NAME"),
                    field: "judgeUserName",
                    width: "120",
                },

                {
                    //headerName: "요청 담당자",
                    headerName: t("@COL_REQUEST_PERSONINCHARGE_NAME"),
                    field: "putUserName",
                    //flex: 0.8,
                    width: 130,
                    tooltipValueGetter: (d: any) => d.data.putUpdateUser,
                },
                {
                    //headerName: "요청 시간",
                    headerName: t("@COL_REQUEST_TIME"),
                    field: "putDt",
                    //flex: 1.4,
                    width: 130,
                    valueFormatter: (d: any) => dateFormat(d.data.putDt),
                    tooltipValueGetter: (d: any) => dateFormat(d.data.putDt),
                },
            ],
        },
        {
            //headerName: "재처리 승인",
            headerName: t("@COL_REWORK_APPROVE"),
            children: [
                {
                    //headerName: "재처리 조건",
                    headerName: t("@COL_REWORK_CONDITION"),
                    field: "approveRemark",
                    width: 150,
                    tooltipValueGetter: (d: any) => d.data.approveRemark,
                },
                {
                    //headerName: "승인 담당자",
                    headerName: t("@COL_APPROVE_PERSONINCHARGE_NAME"),
                    field: "approveUserName",
                    width: 120,
                    tooltipValueGetter: (d: any) => d.data.approveUpdateUser,
                },
                {
                    //headerName: "승인 시간",
                    headerName: t("@COL_APPROVE_TIME"),
                    field: "approveDt",
                    width: 130,
                    valueFormatter: (d: any) => dateFormat(d.data.approveDt),
                    tooltipValueGetter: (d: any) => dateFormat(d.data.approveDt),
                },
            ],
        },
        {
            //headerName: "재처리 반려",
            headerName: t("@COL_REWORK_REFUSAL"),
            headerClass: "leftborder",
            children: [
                {
                    //headerName: "반려 사유",
                    headerName: t("@COL_REFUSAL_REASON"),
                    field: "refuseRemark",
                    //flex: 1.5,
                    width: 150,
                    tooltipValueGetter: (d: any) => d.data.refuseRemark,
                },
                {
                    // headerName: "반려 담당자",
                    headerName: t("@COL_REFUSAL_PERSONINCHARGE_NAME"),
                    field: "refuseUserName",
                    //flex: 0.8,
                    width: 120,
                    tooltipValueGetter: (d: any) => d.data.refuseUpdateUser,
                },
                {
                    //headerName: "반려 시간",
                    headerName: t("@COL_REFUSAL_TIME"),
                    field: "refuseDt",
                    headerClass: "leftborder",
                    //flex: 1.4,
                    width: 130,
                    valueFormatter: (d: any) => dateFormat(d.data.refuseDt),
                    tooltipValueGetter: (d: any) => dateFormat(d.data.refuseDt),
                },
            ],
        },
    ];
}
