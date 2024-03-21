import { ColDef } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Dictionary } from "../../common/types";
import { dateFormat, floatFormat, getLang, getLangAll } from "../../common/utility";

export const ngPanelDefs = (api?: any): Dictionary[] => {
  const { t }  = useTranslation();
  
  const defs = [
    {
      headerName: `BATCH${t("@INFORMATION")}`,//"BATCH정보",
      children: [
        {
          cellClass: "cell-panelid",
          field: "panelId",
          headerName: t("@COL_PANEL_BARCODE"),//"판넬바코드",
          width: 220,
          tooltipValueGetter: (d:any) => d.data.panelId,
        },
        {
          field: "workorderReal",
          headerName: "BATCH",
          width: 160,
          tooltipValueGetter: (d:any) => d.data.workorderReal,
        },
        {
          headerName: t("@COL_ITEM_NAME"),//"제품명",
          field: "itemDescription",
          width: 150,
          tooltipValueGetter: (d:any) => d.data.itemDescription,
        },
        {
          headerName: t("@COL_MODEL_CODE"),//"모델코드",
          field: "modelCode",
          width: 160,
          tooltipValueGetter: (d:any) => d.data.modelCode,
        },
      ]
    },
    {
      headerName: t("@OPERATION"),//"공정",
      children: [
        // {
        //   field: "operSeqNo",
        //   headerName: "공순",
        //   maxWidth: 55,
        // },
        // {
        //   field: "operCode",
        //   headerName: "공정코드",
        //   width: 80,
        //   cellRenderer: (d: any) => {
        //     return d.data.operCode || d.data.operCode4M
        //   }
        // },
        // {
        //   field: "operDescription",
        //   headerName: t("@COL_OPERATION_NAME"),//"공정명",
        //   width: 150,
        //   tooltipValueGetter: (d:any) => d.data.operDescription,
        // },   
        {
          field: "tranOperName",
          headerName: t("@COL_OPERATION_NAME"),//"공정명",
          width: 350,
          tooltipValueGetter: (d:any) => getLang(d.data.tranOperName),
          valueFormatter: (d: any) => getLang(d.data.tranOperName),
        },       
        {
          headerName: t("@COL_EQP_NAME"),//"설비명",
          field: "eqpName",
          width: 180,
          tooltipValueGetter: (d:any) => d.data.eqpName,
        },      
      ]
    },
    {
      headerName: t("@COL_JUDGMENT"),//"판정",
      headerClass: "judge-header",
      children: [
        {
          headerName: "SV",
          field: "recipeJudgeName",
          width: 45,
          cellRenderer: (d: any) => {
            return (
              <>
                <span className={d.data.recipeJudge == 'O' ? "judge-ok" : "judge-ng"}>
                  {d.data.recipeJudgeName}
                </span>
              </>
            );
          }
        },
        {
          headerName: "PV",
          field: "paramJudgeName",
          width: 45,
          cellRenderer: (d: any) => {
            return (
              <>
                <span className={d.data.paramJudge == 'O' ? "judge-ok" : 
                                d.data.paramJudge == 'C' ? "judge-chk" 
                                  : "judge-ng"}>
                  {d.data.paramJudgeName}
                </span>
              </>
            );
          }
        },      
      ]
    },
  ];

  return defs;
}