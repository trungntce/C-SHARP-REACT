import { ColDef } from "ag-grid-community";
import {  dateFormat, devideFormat, currencyFormat, getLang } from "../../../common/utility";
import { useTranslation } from "react-i18next";

export const ngTypes = [
  { headerName: "Open", field: "open" }
, { headerName: "Short", field: "short" }
, { headerName: "손상", field: "3" }
, { headerName: "상부손상", field: "4" }
, { headerName: "돌출", field: "5" }
, { headerName: "Foot", field: "6" }
, { headerName: "Pit", field: "7" }
, { headerName: "Dry film", field: "8" }
, { headerName: "홀터짐", field: "9" }
, { headerName: "Pin Hole", field: "10" }
, { headerName: "홀막힘", field: "11" }
, { headerName: "주름", field: "12" }
, { headerName: "변색", field: "13" }
, { headerName: "흑점", field: "14" }
, { headerName: "과에칭", field: "15" }
, { headerName: "이물", field: "16" }
, { headerName: "Tenting", field: "17" }
, { headerName: "돌기", field: "18" }
, { headerName: "액터짐", field: "19" }
, { headerName: "Dimple", field: "20" }
, { headerName: "VOID", field: "21" }
, { headerName: "CUP 동표면 이상", field: "22" }
, { headerName: "잔동", field: "23" }
, { headerName: "KHAC 기타", field: "24" }
// , { headerName: "Pjt"              , field: "3" }
// , { headerName: "Khac"             , field: "3" }
// , { headerName: "Short_D/F_aor"    , field: "3" }
// , { headerName: "Short_E/T_aor"    , field: "3" }
// , { headerName: "Short_M/D_aor"    , field: "3" }
// , { headerName: "Dc_aor"           , field: "3" }
// , { headerName: "Aor"              , field: "3" }
// , { headerName: "Miss_feature"     , field: "3" }
// , { headerName: "Skip_pcb"         , field: "3" }
// , { headerName: "Short_point"      , field: "3" }
];

const ngCols: ColDef<any>[] = [];
ngTypes.forEach( ng=> {
  const valueCol = {headerName: ng.headerName, field: ng.field, width: 110, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data[ng.field])};
  const percentCol = {headerName: "점유율", cellClass: "cell-silver cell-right", width: 80, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data[ng.field], d.data.ngcnt, )};

  ngCols.push(valueCol);
  ngCols.push(percentCol);
});

export const columnCountDefs = () => {
  const { t } = useTranslation();
  return [
    {
      field: "createDt",
      headerName: "일자",
      width: 130,
      headerClass: "no-leftborder",
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.createDt)
          return "0";
  
        if(d.data.createDt.toUpperCase().indexOf("TOTAL") >= 0 || 
          d.data.createDt.toUpperCase().indexOf("SUM") >= 0 || 
          d.data.createDt.toUpperCase().indexOf("AMOUNT") >= 0)
          return ( <div className="text-center">{d.data.createDt}</div> );  
  
        return dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm")
      }
    },
    {
      headerName: t("@COL_VENDOR_NAME"), //"고객사",
      field: "vendorName",
      width: 150,     
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
      field: "modelCode",
      headerName: t("@COL_MODEL_CODE"), //"모델코드",
      width: 170,
    },
    {
      field: "workorder",
      headerName: "BATCH",
      width: 200,
    },
    {
      field: "eqpCode",
      headerName: t("@COL_EQP_CODE"), //"설비코드",
      width: 150,
    },
    {
      field: "eqpName",
      headerName: t("@COL_EQP_NAME"), //"설비명",
      width: 190,
    },  
    {
      field: "operSeqNo",
      headerName: t("@OPER_SEQ"), //"공순",
      width: 90,
    },  
    // {
    //   field: "appName",
    //   headerName: "Application",
    //   width: 120,
    // },
    {
      headerName: t("@COL_INSPECTION_QUANTITY"), //"검사수량",
      children: [
        {headerName: `${t("@COL_TOTAL_INSPECTION_QUANTITY")}(PCS)`, field: "pcsTotal", width: 140, type: 'rightAligned', valueFormatter: (d:any) => d.data.pcsTotal ? currencyFormat(d.data.pcsTotal) : 0}, //총 검사수랑(PCS)
        {headerName: `${t("@COL_DEFECT_QUANTITY")}(PCS)`, field: "ngPcsTotal", width: 140, type: 'rightAligned', valueFormatter: (d:any) => d.data.ngPcsTotal ? currencyFormat(d.data.ngPcsTotal) : 0},  //불량수량(PCS)
        {headerName: `${t("@COL_DEFECT_RATE")}(%)`, field: "ng_rate", width: 90, type: 'rightAligned', valueFormatter: (d:any) => d.data.pcsTotal ? devideFormat(d.data.ngPcsTotal, d.data.pcsTotal) : 0}, //불량률(%)
        {headerName: "PNL", field: "panelCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.panelCnt)},
        {headerName: `DEFECT ${t("@COL_COUNT")}`, field: "ngcnt", width: 90, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.ngcnt)}, //"DEFECT 수",
        {headerName: "DEFECT/PNL", field: "defect_pnl", width: 120, type: 'rightAligned', valueFormatter: (d:any) => (d.data.ngcnt / d.data.panelCnt).toFixed(2)},
      ]
    },
    {
      headerName: `DEFECT ${t("COL_COUNT")}`, //"DEFECT 수",
      children: ngCols
    },
  ]
}

export const columnErrorDefs = () => {
  const { t } = useTranslation();
  return [
    {
      field: "createDt",
      headerName: t("@COL_DATE_TYPE2"), //"일자",
      width: 100,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.createDt)
          return 0
  
        return dateFormat(d.data.createDt, "YYYY-MM-DD")
      }
    },
    {
      field: "panelId",
      headerName: `PNL ${t("@COL_BARCDOE")}`, //"PNL 바코드",
      width: 250,
    },
    // {
    //   field: "pnlno",
    //   headerName: "PNL",
    //   width: 60,
    //   type: 'rightAligned',
    // },
    // {
    //   field: "piece",
    //   headerName: "PCS",
    //   flex: 0.5,
    //   type: 'rightAligned',
    // },
    {
      field: "ngName",
      headerName: t("@COL_DEFECT_NAME"), //"불량명",
      width: 120,
      valueFormatter: (d: any) => getLang(d.data.ngName),
    },
  ]
}