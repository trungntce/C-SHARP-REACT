import { ColDef } from "ag-grid-community";
import { currencyFormat, dateFormat, devideFormat, getLangAll, percentFormat } from "../../../common/utility";
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
  const valueCol = {headerName: ng.headerName, field: ng.field, width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data[ng.field])};
  const percentCol = {headerName: "불량률", cellClass: "cell-silver cell-right", width: 70, type: 'rightAligned', valueFormatter: (d:any) => devideFormat(d.data[ng.field], d.data.totalCnt, )};

  ngCols.push(valueCol);
  ngCols.push(percentCol);
});

export const columnDefs = () =>{
  const { t } =  useTranslation();
 return [  
  {
    headerClass: "no-leftborder",
    headerName: t("@COL_ITEM_CODE"),//"제품코드",
    field: "itemCode",
    width: 150,
  },
  {
    headerName: t("@COL_MODEL_NAME"),//"모델명",
    field: "modelDescription",
    width: 170,
  },
  {
    headerName: t("@OPERATION"),//"공정",
    field: "operDescription",
    width: 150,
  },
  // {
  //   headerName: "공정",
  //   field: "tranOperName",
  //   width: 300,
  //   valueFormatter: (d: any) => getLang(d.data.tranOperName),
  // },
  {
    headerName: t("@COL_EQP_CODE"),//"설비코드",
    field: "prevEqpCode",
    width: 130,
  },
  {
    headerName: t("@COL_EQP_NAME"),//"설비명",
    field: "prevEqpName",
    width: 190,
  },  
  {
    headerName: t("@COL_DATE"),//"일시",
    field: "createDt",
    width: 125,
    valueFormatter: (d: any) => dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm"),
  },  
  {
    headerName: t("@COL_INSPECTION_QUANTITY"),//"검사수량",
    children: [
      {headerName: "PNL", field: "panelCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.panelCnt), filter: "agNumberColumnFilter" },
      {headerName: "PCS", field: "totalCnt", width: 80, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.totalCnt), filter: "agNumberColumnFilter" },
      {headerName: t("@COL_DEFECT"), field: "ngCnt", width: 70, type: 'rightAligned', valueFormatter: (d:any) => currencyFormat(d.data.ngCnt), filter: "agNumberColumnFilter"},//"불량"
      {headerName: t("@COL_DEFECT_RATE"), cellClass: "cell-silver cell-right", field: "ngRate", width: 70, type: 'rightAligned', valueFormatter: (d:any) => percentFormat(d.data.ngRate), filter: "agNumberColumnFilter"},//"불량률"
    ]
  },
  {
    headerName: `${t("@COL_DEFECT")}(${t("@COL_JUDGMENT_REFERENCE")})`,//"불량(판정 기준)",
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
    headerName: `${t("@COL_DEFECT")}(${t("@COL_INSPECTION_REFERENCE")})`,//"불량(검사 기준)",
    children: ngCols
  },
]

}