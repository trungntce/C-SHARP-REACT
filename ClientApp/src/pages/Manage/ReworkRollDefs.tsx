import { ColDef } from "ag-grid-community";
import { dateFormat, getLang, getLangAll } from "../../common/utility";
import { useTranslation } from "react-i18next";

export const ReworkRollDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: "ID",
      headerClass: "no-leftborder",
      children: [
        {
          headerName: t("@COL_PARENT_ROLL_ID"),//"부모 롤 ID",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          field: "parentRollId",
          //flex: 2,
          width: 200,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.parentRollId,
        },
        {
          headerName: t("@COL_CHILD_LOL_ID"),//"자식 롤 ID",
          field: "rollId",
          //flex: 2,
          width: 200,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.rollId,
        },
      ],
    },
    {
      headerName: t("@APPROVE"),//"승인",
      headerClass: "real-leftborder",
      children: [
        {
          headerName: t("@APPROVAL_STATUS"),//"승인 여부",
          field: "reworkApproveYn",
          //flex: 1.2,
          width: 90,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.reworkApproveYn,
        },
      ],
    },
    {
      headerName: t("@COL_REWORK_REQUEST"),//"재처리 요청",
      children: [
        {
          headerName: t("@COL_OPERATION_SEQ_NO"),//"공정 순서",
          field: "operSeq",
          //flex: 1.3,
          width: 110,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.operSeq,
        },
        {
          headerName: t("@COL_OPERATION_CODE"),//"공정 코드",
          field: "operCode",
          //flex: 1.3,
          width: 110,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.operCode,
        },
          // {
          //   headerName: "공정명",
          //   field: "operName",
          //   //flex: 1.3,
          //   width: 170,
          //   cellStyle: {textAlign: 'center'},
          //   tooltipValueGetter: (d:any) => d.data.operName,
          // },
        {
          headerName: "공정명",
          field: "tranOperName",
          //flex: 1.3,
          width: 300,
          tooltipValueGetter: (d: any) => getLang(d.data.tranOperName),
          valueFormatter: (d: any) => getLang(d.data.tranOperName),
        },
        {
          headerName: t("@REMARKS"),//"비고",
          field: "putRemark",
          //flex: 1.5,
          width: 200,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.putRemark,
        },
        // {
        //   headerName: "재처리 코드",
        //   field: "reworkCode",
        //   flex: 1,
        //   cellStyle: {textAlign: 'center'},
        //   tooltipValueGetter: (d:any) => d.data.reworkCode,
        // },
        {
          headerName: t("@COL_REWORK_NAME"),//"재처리 이름",
          field: "reworkName",
          //flex: 1,
          width: 130,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.reworkCode,
        },
        {
          headerName: t("@COL_EMPLOYEE"),//"직원",
          field: "putUpdateUser",
          //flex: 0.8,
          width: 130,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.putUpdateUser,
        },
        {
          headerName: t("@COL_REQUEST_TIME"),//"요청 시간",
          field: "putDt",
          //flex: 1.4,
          width: 150,
          cellStyle: {textAlign: 'center'},
          valueFormatter: (d: any) => dateFormat(d.data.putDt),
          tooltipValueGetter: (d:any) => dateFormat(d.data.putDt),
        },
      ],
    },
    {
      headerName: t("@COL_REWORK_APPROVE"),//"재처리 승인",
      children: [
        {
          headerName: t("@COL_REWORK_CONDITION"),//"재처리 조건",
          field: "approveRemark",
          //flex: 1.5,
          width: 200,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.approveRemark,
        },
        {
          headerName: t("@COL_EMPLOYEE"),//"직원",
          field: "approveUpdateUser",
          //flex: 0.8,
          width: 130,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.approveUpdateUser,
        },
        {
          headerName: t("@COL_APPROVE_TIME"),//"승인 시간",
          field: "approveDt",
          //flex: 1.4,
          width: 150,
          cellStyle: {textAlign: 'center'},
          valueFormatter: (d: any) => dateFormat(d.data.approveDt),
          tooltipValueGetter: (d:any) => dateFormat(d.data.approveDt),
        },
      ],
    },
    {
      headerName: t("@COL_REWORK_REFUSAL"),//"재처리 반려",
      headerClass: "leftborder",
      children: [
        {
          headerName: t("@COL_REFUSAL_REASON"),//"반려 사유",
          field: "refuseRemark",
          //flex: 1.5,
          width: 180,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.refuseRemark,
        },
        {
          headerName: t("@COL_EMPLOYEE"),//"직원",
          field: "refuseUpdateUser",
          //flex: 0.8,
          width: 130,
          cellStyle: {textAlign: 'center'},
          tooltipValueGetter: (d:any) => d.data.refuseUpdateUser,
        },
        {
          headerName: t("@COL_REFUSAL_TIME"),//"반려 시간",
          field: "refuseDt",
          headerClass: "leftborder",
          //flex: 1.4,
          width: 150,
          cellStyle: {textAlign: 'center'},
          valueFormatter: (d: any) => dateFormat(d.data.refuseDt),
          tooltipValueGetter: (d:any) => dateFormat(d.data.refuseDt),
        },
      ],
    },
  ];
}
