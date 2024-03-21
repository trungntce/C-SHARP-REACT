import { ColDef } from "ag-grid-community";
import { currencyFormat, dateFormat, devideFormat, getLang, getLangAll, percentFormat } from "../../../common/utility";
import { useTranslation } from "react-i18next";

export const ngTypes = [
  { headerName: "None"              , field: "none" }
, { headerName: "Short_D/F"         , field: "shortDf" }
, { headerName: "Short_E/T"         , field: "shortEt" }
, { headerName: "Short_M/D"         , field: "shortMd" }
, { headerName: "Short_D/F_repair"  , field: "shortDfRepair" }
, { headerName: "Short_E/T_repair"  , field: "shortEtRepair" }
, { headerName: "Short_M/D"         , field: "shortMd6" }
, { headerName: "Open_D/F"          , field: "openDf" }
, { headerName: "Open_E/T"          , field: "openEt" }
, { headerName: "Open_madong"       , field: "openMadong" }
, { headerName: "Slit_D/F"          , field: "slitDf" }
, { headerName: "Slit_E/T"          , field: "slitEt" }
, { headerName: "Slit_madong"       , field: "slitMadong" }
, { headerName: "Open_qc"           , field: "openQc" }
, { headerName: "Dong_cuc"          , field: "dongCuc4" }
, { headerName: "Dong_cuc"          , field: "dongCuc5" }
, { headerName: "Pine_hole"         , field: "pineHole" }
, { headerName: "Lech_hole_D/F"     , field: "lechHoleDf" }
, { headerName: "Lech_hole_cnc"     , field: "lechHoleCnc" }
, { headerName: "Chua_mon"          , field: "chuaMon" }
, { headerName: "Tran_dong"         , field: "tranDong0" }
, { headerName: "Tran_dong"         , field: "tranDong1" }
, { headerName: "Tac_hole"          , field: "tacHole" }
, { headerName: "Tenting"           , field: "tenting" }
, { headerName: "Pjt"               , field: "pjt" }
, { headerName: "Khac"              , field: "khac" }
, { headerName: "Short_D/F_aor"     , field: "shortDfAor" }
, { headerName: "Short_E/T_aor"     , field: "shortEtAor" }
, { headerName: "Short_M/D_aor"     , field: "shortMdAor" }
, { headerName: "Dc_aor"            , field: "dcAor" }
, { headerName: "Aor"               , field: "aor" }
, { headerName: "Miss_feature"      , field: "missFeature" }
, { headerName: "Skip_pcb"          , field: "skipPcb" }
, { headerName: "Short_point"       , field: "shortPoint" }
];

const ngCols: ColDef<any>[] = [];
ngTypes.forEach(ng => {
  const valueCol = {headerName: ng.headerName, field: ng.field, width: 110, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data[ng.field])};
  const percentCol = {headerName: "share", cellClass: "cell-silver cell-right", width: 90, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data[ng.field], d.data.ngCnt, )};

  ngCols.push(valueCol);
  ngCols.push(percentCol);
});

export const columnDefs = () => {
  const { t } = useTranslation();
  return [ 
    {
      headerClass: "no-leftborder",
      headerName: t("@COL_ITEM_CODE"), //"제품코드",
      field: "itemCode",
      width: 150,
    },
    {
      headerName: t("@COL_MODEL_NAME"), //"모델명",
      field: "modelDescription",
      width: 250,
    },
    // {
    //   headerName: t("@OPERATION"), //"공정",
    //   field: "operDescription",
    //   width: 300,
    // },
    {
      headerName: t("@OPERATION"), //"공정",
      field: "tranOperDescription",
      width: 350,
      valueFormatter: (d: any) => getLang(d.data.tranOperDescription),
    },
    {
      headerName: t("@COL_EQP_CODE"), //"설비코드",
      field: "prevEqpCode",
      width: 150,
    },
    {
      headerName: t("@COL_EQP_NAME"), //"설비명",
      field: "prevEqpName",
      width: 200,
    },  
    {
      headerName: "Layer",
      field: "layer",
      width: 60,
    },  
    {
      headerName: t("@COL_DATE"), //"일시",
      field: "createDt",
      width: 125,
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm"),
    },  
    {
      headerName: t("@COL_INSPECTION_QUANTITY"), //"검사수량",
      children: [
        {headerName: "PNL", field: "panelCnt", maxWidth: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.panelCnt)},
        {headerName:  `DEFECT ${t("@COL_COUNT")}`, field: "ngCnt", maxWidth: 90, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.ngCnt)},
        {headerName: "DEFECT/PNL", field: "defectPerPanel", maxWidth: 120, type: 'rightAligned', valueFormatter: (d:any) => {
          if(!d.data.defectPerPanel)
            return (d.data.ngCnt / d.data.panelCnt).toFixed(2);
  
          return d.data.defectPerPanel.toFixed(2)
        }
      },
      ]
    },
    {
      headerName: `DEFECT ${t("@COL_COUNT")}`,
      children: ngCols
    },
  ]
}