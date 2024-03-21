import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../common/utility";
import { useTranslation } from "react-i18next";

export const InterlockHistoryDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: "ID",
      headerClass: "no-leftborder",
      children: [
        {
          headerName: "Roll ID",
          field: "rollId",
          headerCheckboxSelection: true,
          checkboxSelection: true,
          flex: 1.5,
          tooltipValueGetter: (d:any) => d.data.rollId,
        },
        {
          headerName: "PNL ID",
          field: "panelId",
          flex: 1.2,
          tooltipValueGetter: (d:any) => d.data.panelId,
        },
      ],
    },
    {
      headerName: `${t("@COL_INTERLOCK")} ON`, //"인터락 ON",
      children: [
        {
          headerName: `${t("@COL_INTERLOCK")} Code`, //"인터락 코드",
          field: "interlockCode",
          flex: 1,
          tooltipValueGetter: (d:any) => d.data.interlockCode,
        },
        {
          headerName: `${t("@COL_INTERLOCK")} ${t("@CODE_NAME")}`, //"인터락 코드명",
          field: "interlockName",
          flex: 1,
          tooltipValueGetter: (d:any) => d.data.interlockCode,
        },
        {
          headerName: t(""), //"비고",
          headerClass: "real-leftborder",
          field: "onRemark",
          flex: 2,
          tooltipValueGetter: (d:any) => d.data.onRemark,
        },
        {
          headerName: t("@REMARKS"), //"자동여부",
          field: "autoYn",
          flex: 0.8,
          tooltipValueGetter: (d:any) => d.data.autoYn,
        },
        {
          headerName: t("@WORKER"), //"작업자",
          field: "onUserName",
          flex: 1,
          valueFormatter: (d: any) => d.data.onUserName || d.data.onUpdateUser,
          tooltipValueGetter: (d:any) => d.data.onUpdateUser,
        },
        {
          headerName: t("@REGISTER_TIME"), //"등록 시간",
          field: "onDt",
          flex: 1.2,
          valueFormatter: (d: any) => dateFormat(d.data.onDt),
          tooltipValueGetter: (d:any) => dateFormat(d.data.onDt),
        },
      ]
    },
    {
      headerName: `${t("@COL_INTERLOCK")} OFF`, //"인터락 OFF",
      headerClass: "leftborder",
      children: [
        {
          headerName: t("@COL_RELEASING_REASON"), //"해제 사유",
          field: "offRemark",
          flex: 2,
          tooltipValueGetter: (d:any) => d.data.offRemark,
        },
        {
          headerName: t("@WORKER"), //"작업자",
          field: "offUserName",
          flex: 1,
          valueFormatter: (d: any) => d.data.offUserName || d.data.offUpdateUser,
          tooltipValueGetter: (d:any) => d.data.offUpdateUser,
        },
        {
          headerName: t("@COL_RELEASE_TIME"), //"해제 시간",
          headerClass: "leftborder",
          field: "offDt",
          flex: 1.2,
          valueFormatter: (d: any) => dateFormat(d.data.offDt),
          tooltipValueGetter: (d:any) => dateFormat(d.data.offDt),
        },
      ]
    }
  ]
};
