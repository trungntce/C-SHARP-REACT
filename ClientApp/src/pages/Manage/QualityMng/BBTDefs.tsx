import { ColDef } from "ag-grid-community";
import { currencyFormat, dateFormat, devideFormat, percentFormat } from "../../../common/utility";
import { useTranslation } from "react-i18next";

export const ngTypes = [
    { headerName: '4WNG' 	        , field: 'raw4wng' }
,   { headerName: 'SHORT' 	      , field: 'rawshort' }
,   { headerName: 'SHORTS2' 	    , field: 'rawshorts2' }
,   { headerName: 'uSH2' 	        , field: 'rawush2' }
,   { headerName: '4WNG uSH2' 	  , field: 'raw4wngush2' }
,   { headerName: 'OPEN' 	        , field: 'rawopen' }
,   { headerName: 'OPEN SHORTS' 	, field: 'rawopenshorts' }
,   { headerName: 'uSH1' 		      , field: 'rawush1' }
,   { headerName: 'AUX' 		      , field: 'rawaux' }
,   { headerName: '4WNG SHORT' 	  , field: 'raw4wngshort' }
,   { headerName: 'OPEN SHORT' 	  , field: 'rawopenshort' }
,   { headerName: 'OPEN SPARK' 	  , field: 'rawopenspark' }
,   { headerName: 'SPARK' 	      , field: 'rawspark' }
,   { headerName: '4WNG SPARK' 	  , field: 'raw4wngspark' }
,   { headerName: 'OPEN uSH2' 	  , field: 'rawopenush2' }
,   { headerName: '4WNG SHORTS' 	, field: 'raw4wngshorts' }
,   { headerName: '4WNG uSH1' 	  , field: 'raw4wngush1' }
,   { headerName: 'SHORTS' 	      , field: 'rawshorts' }
,   { headerName: 'C' 	          , field: 'rawc' }
,   { headerName: 'ERROR' 		    , field: 'rawerror' }
,   { headerName: 'OPEN uSH1' 	  , field: 'rawopenush1' }
];

const ngCols: ColDef<any>[] = [];
ngTypes.forEach(ng => {
  const valueCol = {headerName: ng.headerName, field: ng.field, width: 120, type: 'rightAligned', 
    valueFormatter: (d:any) => currencyFormat(d.data[ng.field]),
    filter: "agNumberColumnFilter"
  };
  const percentCol = {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', 
    valueFormatter: (d:any) => devideFormat(d.data[ng.field], d.data.totalCnt, ),
    valueGetter: (d:any) => d.data[ng.field] * 100 / d.data.totalCnt,
    filter: "agNumberColumnFilter"
  };

  ngCols.push(valueCol);
  ngCols.push(percentCol);
});

export const columnDefs = () => {
  const { t } = useTranslation();
  return [ 
    {
      headerName: t("@COL_DATE_TYPE2"), //"일자",
      field: "mesDate",
      maxWidth: 100,
      headerClass: "no-leftborder",
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.mesDate)
          return "0";
  
        if(d.data.mesDate.toUpperCase().indexOf("TOTAL") >= 0 || 
          d.data.mesDate.toUpperCase().indexOf("SUM") >= 0 || 
          d.data.mesDate.toUpperCase().indexOf("AMOUNT") >= 0)
          return ( <div><span>{d.data.mesDate}</span><span className="grid-top-detail-label"></span></div> );  
    
        return dateFormat(d.data.mesDate, "YYYY-MM-DD")
      },
      colSpan: (params: any) => {
        if(params.node.rowPinned == "top")
          return 4;
          
        return 1;
      }
    },
    {
      headerName: t("@COL_VENDOR_NAME"), //"고객사",
      field: "vendorName",
      // maxWidth: 150,  // 컬럼 크기 조절 되기 전
      width: 150,     
    },
    {
      headerName: t("@COL_ITEM_CODE"), //"제품코드",
      field: "itemCode",
      // maxWidth: 150,  // 컬럼 크기 조절 되기 전
      width: 150,     
    },
    {
      headerName: t("@COL_ITEM_NAME"), //"제품명",
      field: "itemName",
      // maxWidth: 190,  // 컬럼 크기 조절 되기 전
      width: 190,     
    },
    {
      headerName: t("@COL_MODEL_CODE"), //"모델코드",
      field: "modelCode",
      // maxWidth: 170,  // 컬럼 크기 조절 되기 전
      width: 170,     
    },
    {
      headerName: "BATCH",
      field: "workorder",
      maxWidth: 200,
      cellClass: "cell-link"
    },
    {
      headerName: "PANEL No",
      field: "panelId",
      minWidth: 250,
      cellClass: "cell-link"
    },
    {
      headerName: "PANEL ID",
      field: "matchPanelId",
      minWidth: 250,
    },
    {
      headerName: t("@COL_EQP_CODE"), //"설비코드",
      field: "eqpCode",
      maxWidth: 150,
    },
    {
      headerName: t("@COL_EQP_NAME"), //"설비명",
      field: "eqpName",
      maxWidth: 190,
    },  
    {
      headerName: "Application",
      field: "appName",
      maxWidth: 120,
    },
    {
      headerName: t("@COL_INSPECTION_QUANTITY"), //"검사수량",
      children: [
        {headerName: "PNL", field: "panelCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.panelCnt), filter: "agNumberColumnFilter" },
        {headerName: "PCS", field: "totalCnt", width: 80, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.totalCnt), filter: "agNumberColumnFilter" },
        {headerName: t("@COL_DEFECT"), field: "ngCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.ngCnt), filter: "agNumberColumnFilter"}, //"불량"
        {headerName: t("@COL_DEFECT_RATE"), cellClass: "cell-silver cell-right", field: "ngRate", width: 70, type: 'rightAligned', valueFormatter: (d:any) => percentFormat(d.data.ngRate), filter: "agNumberColumnFilter"}, //"불량률"
      ]
    },
    {
      headerName: `${t("@COL_DEFECT")}(${t("@COL_JUDGMENT_REFERENCE")})`, //"불량(판정 기준)",
      children: [
        {headerName: "4W", field: "4WCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data["4WCnt"]), filter: "agNumberColumnFilter"},
        {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data["4WCnt"], d.data.totalCnt, ), valueGetter: (d:any) => d.data["4WCnt"] * 100 / d.data.totalCnt, filter: "agNumberColumnFilter"},
  
        {headerName: "Aux", field: "auxCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data["auxCnt"]), filter: "agNumberColumnFilter"},
        {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data["auxCnt"], d.data.totalCnt, ), valueGetter: (d:any) => d.data["auxCnt"] * 100 / d.data.totalCnt, filter: "agNumberColumnFilter"},
  
        {headerName: "Both", field: "bothCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data["bothCnt"]), filter: "agNumberColumnFilter"},
        {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data["bothCnt"], d.data.totalCnt, ), valueGetter: (d:any) => d.data["bothCnt"] * 100 / d.data.totalCnt, filter: "agNumberColumnFilter"},
  
        {headerName: "C", field: "cCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data["cCnt"]), filter: "agNumberColumnFilter"},
        {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data["cCnt"], d.data.totalCnt, ), valueGetter: (d:any) => d.data["cCnt"] * 100 / d.data.totalCnt, filter: "agNumberColumnFilter"},
  
        {headerName: "ER", field: "erCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data["erCnt"]), filter: "agNumberColumnFilter"},
        {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data["erCnt"], d.data.totalCnt, ), valueGetter: (d:any) => d.data["erCnt"] * 100 / d.data.totalCnt, filter: "agNumberColumnFilter"},
  
        {headerName: "Open", field: "openCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data["openCnt"]), filter: "agNumberColumnFilter"},
        {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data["openCnt"], d.data.totalCnt, ), valueGetter: (d:any) => d.data["openCnt"] * 100 / d.data.totalCnt, filter: "agNumberColumnFilter"},
  
        {headerName: "SPK", field: "spkCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data["spkCnt"]), filter: "agNumberColumnFilter"},
        {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data["spkCnt"], d.data.totalCnt, ), valueGetter: (d:any) => d.data["spkCnt"] * 100 / d.data.totalCnt, filter: "agNumberColumnFilter"},
          
        {headerName: "Short", field: "shortCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data["shortCnt"]), filter: "agNumberColumnFilter"},
        {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data["shortCnt"], d.data.totalCnt, ), valueGetter: (d:any) => d.data["shortCnt"] * 100 / d.data.totalCnt, filter: "agNumberColumnFilter"},
      ]
    },
    {
      headerName:`${t("@COL_DEFECT")}(${t("@COL_JUDGMENT_REFERENCE")})`, //"불량(검사 기준)",
      children: ngCols
    },
  ]
}