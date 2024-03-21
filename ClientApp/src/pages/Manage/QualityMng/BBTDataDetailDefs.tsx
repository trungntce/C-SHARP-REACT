import { ColDef } from "ag-grid-community";
import { currencyFormat, dateFormat, devideFormat, nullGuard, percentFormat } from "../../../common/utility";

const devide = (a?: number, b?: number) => { 
  if (b === 0 || null === a || null === b || undefined === a || undefined === b) return '';
  return (a / b).toFixed(2);
}

const devideCheck = (num: number, denom: number, fixed: number = 2, postfix: string = '%') => {
  if(!num && num !== 0)
    return "";

  if(!denom && denom !== 0)
    return "";

  if(denom === 0)
    return "";

  const formatted = (num / denom * 100).toFixed(fixed);
  return `${formatted}${postfix}`;
}

export const columnWorkorderDefs = [
  {
    headerName: "NO",
    headerClass: 'cell-header-group-1',
    field: "rowNum",
    width: 60,
  },
  {
    headerName: "PNL ID",
    headerClass: 'cell-header-group-1',
    field: "matchPanelId",
    width: 180,
  },
  {
    headerName: "PNL불량율",
    headerClass: 'cell-header-group-1',
    valueFormatter: (d: any) => d.data.totalCnt > 0 ? devideCheck(d.data.worstTotal, d.data.totalCnt,) : '0.00%',
    filter: "agNumberColumnFilter",
    width: 120,
  },
  {
    headerName: "DPU",
    headerClass: 'cell-header-group-1',
    field: "worstTotal",
    valueFormatter: (d:any) => (d.data.worstTotal / 1)?? 0,
    width: 80,
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "WORST 불량",
    headerClass: 'cell-header-group-1',
    field: "judgeName",
    width: 120,
    filter: "agNumberColumnFilter",
  },
  {
    headerName: "WORST 불량율",
    headerClass: 'cell-header-group-1',
    field: "dpuRate",
    width: 120,
    filter: "agNumberColumnFilter",
    valueFormatter: (d: any) => d.data.totalCnt > 0 ? devideFormat(d.data.judgeCnt, d.data.totalCnt): '0.00%',
  },
  {
    headerName: "SCAN 시간",
    headerClass: 'cell-header-group-1',
    field: "scanTime",
    minWidth: 150,
    cellRenderer: (d: any) => { return dateFormat(d.data.scanTime, "YYYY-MM-DD HH:mm:ss") },
    cellStyle: {
      textAlign: 'center'
    },
  }
];

export const ngTypes = [
  { headerName: '4W' 	        , field: '4WCnt' }
,   { headerName: 'AUX' 	      , field: 'auxCnt' }
,   { headerName: 'BOTH' 	    , field: 'bothCnt' }
,   { headerName: 'C' 	        , field: 'cCnt' }
,   { headerName: 'ER' 	  , field: 'erCnt' }
,   { headerName: 'OPEN' 	        , field: 'openCnt' }
,   { headerName: 'SPK ' 	, field: 'spkCnt' }
,   { headerName: 'SHORTS' 		      , field: 'shortCnt' }
];

const ngCols: ColDef<any>[] = [];
ngTypes.forEach(ng => {
  const valueCol = {
    headerName: ng.headerName,
    headerClass: 'cell-header-group-4',
    children: [
      {headerName: "수량", field: ng.field, width: 70, headerClass: 'cell-header-group-5', valueFormatter: (d: any) => currencyFormat(d.data[ng.field]), filter: "agNumberColumnFilter" },
      {headerName: "기준 DPU", field: ng.field +'StdRate', valueGetter: (d:any) => d.data[ng.field +'StdRate'], width: 85, headerClass: 'cell-header-group-5', filter: "agNumberColumnFilter" },
      {headerName: "DPU", field: ng.field, width: 70, valueGetter: (d:any) => devide(d.data[ng.field], d.data.panelCnt), headerClass: 'cell-header-group-5', filter: "agNumberColumnFilter"},
      {headerName: "불량률", width: 70, headerClass: 'cell-header-group-5', valueFormatter: (d:any) => devideFormat(d.data[ng.field], d.data.totalCnt), filter: "agNumberColumnFilter"},    
    ]
  };
  
ngCols.push(valueCol);
});

export const columnDefs = [ 
{
  headerName: "제품 정보",
  headerClass: 'no-leftborder cell-header-group-1',
  cellStyle: {
    textAlign: 'center',
    width: '100%'
  },
    children: [
   // { headerName: "제품코드",field: "itemCode", headerClass: 'cell-header-group-2', cellClass: "cell-link" },
    { headerName: "제품명", field: "itemName",width: 180, headerClass: 'cell-header-group-2' },
    { headerName: "모델코드",field: "modelCode",width: 160, headerClass: 'cell-header-group-2' },
    { headerName: "BATCH",field: "workorder",width: 180, headerClass: 'cell-header-group-2' },
    //{ headerName: "장비코드",field: "eqpCode", cellStyle: { textAlign: 'center' }, headerClass: 'cell-header-group-2' },
    { headerName: "장비명",field: "eqpName",width: 170, headerClass: 'cell-header-group-2' },
    { headerName: "TOOL",field: "toolId",width: 150, headerClass: 'cell-header-group-2' },
    //{ headerName: "Application",field: "appName",width: 90, headerClass: 'cell-header-group-2' },  
  ]
  },
  {
    headerName: "검사수량",
    headerClass: 'cell-header-group-1 ',
    children: [
      {
        headerComponentParams: {
          template: '<div class="header-wrapper"><p></p>&nbsp;&nbsp;&nbsp;총 검사수랑<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(PCS)</p></div>',
        },
        resizable: false
        ,width: 105, field: "totalCnt", headerClass: 'cell-header-group-2', valueFormatter: (d:any) => currencyFormat(d.data.totalCnt), filter: "agNumberColumnFilter" },
      {headerName: "PNL", field: "panelCnt", width: 70, headerClass: 'cell-header-group-2',valueFormatter: (d:any) => currencyFormat(d.data.panelCnt), filter: "agNumberColumnFilter"},
      {
        headerComponentParams: {
          template: '<div class="header-wrapper"><p></p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;불량수량<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(PCS)</p></div>',
        },
        resizable: false
        ,width: 100, field: "ngCnt", headerClass: 'cell-header-group-2', valueFormatter: (d:any) => currencyFormat(d.data.ngCnt), filter: "agNumberColumnFilter"},
    ]
  },
{
  headerName: "불량율",
  headerClass: 'cell-header-group-1 ',
  children: [
    {headerName: "불량율", field: "ngRate",width: 90, headerClass: 'cell-header-group-2',valueFormatter: (d:any) => devideFormat(d.data.ngCnt, d.data.totalCnt), filter: "agNumberColumnFilter" },
    //{headerName: "불량율", field: "ngRate",width: 90, headerClass: 'cell-header-group-2',valueFormatter: (d:any) => devideFormat(d.data.totalDefect, d.data.totalCnt), filter: "agNumberColumnFilter" },
    {headerName: "기준불량율", field: "stdRate", width: 100, headerClass: 'cell-header-group-2', filter: "agNumberColumnFilter" },
    {headerName: "DEFECT 수", width: 90, field: "totalDefect", headerClass: 'cell-header-group-2',valueFormatter: (d:any) => currencyFormat(d.data.totalDefect), filter: "agNumberColumnFilter"},
    {headerName: "DPU", width: 90, field: "defectRate", headerClass: 'cell-header-group-2', valueGetter: (d:any) => devide(d.data.totalDefect, d.data.panelCnt), filter: "agNumberColumnFilter"},
  ]
},
{
  headerName: "불량항목",
  headerClass: 'cell-header-group-3',
  children: ngCols,
},
{ headerName: "MES일자", field: "mesDate", width: 100, headerClass: "no-leftborder cell-header-group-2", cellRenderer: (d: any) => { return dateFormat(d.data.mesDate, "YYYY-MM-DD") } },
{ headerName: "4M등록 시간", field: "startDt", width: 100, headerClass: 'cell-header-group-2' ,cellRenderer: (d: any) => { return dateFormat(d.data.startDt, "YYYY-MM-DD") }},
{ headerName: "4M END 시간", field: "endDt", width: 100, headerClass: 'cell-header-group-2' , cellRenderer: (d: any) => { return dateFormat(d.data.endDt, "YYYY-MM-DD") }},
]

export const columnPanelDefs = [
  {
    field: "rowId",
    headerName: "NO",
    headerClass: 'cell-header-group-1',
    width: 60,
  },
  {
    field: "judgeName",
    headerName: "불량항목",
    headerClass: 'cell-header-group-1',
    width: 90,
  },
  {
    field: "pnlRate",
    headerName: "PNL DPU",
    headerClass: 'cell-header-group-1',
    width: 90,
  },
  {
    field: "ngRate",
    headerName: "불량 점유율",
    headerClass: 'cell-header-group-1',
    width: 100,
  },
  {
    field: "rollId",
    headerName: "ROLL ID",
    headerClass: 'cell-header-group-1',
    width: 100,
  },
  {
    field: "eqpName",
    headerName: "장비명",
    headerClass: 'cell-header-group-1',
    width: 180,
  },
  {
    field: "scanTime",
    headerName: "SCAN 시간",
    width: 150,
    cellRenderer: (d: any) => {
      if(!d.data || !d.data.scanTime)
        return ''

      return dateFormat(d.data.scanTime, "YYYY-MM-DD HH:mm:ss")
    }
  },
  {
    headerName: "설비 진행 이력",
    children: [
      {
        headerName: "공순",
        headerClass: 'cell-header-group-2',
        width: 90,
        field: "operSeqNo",
      },
      {
        headerName: "공정명",
        headerClass: 'cell-header-group-2',
        width: 180,
        field: "operDescription",
      },
      {
        headerName: "롤/판넬바코드",
        headerClass: 'cell-header-group-2',
        width: 200,
        field: "eqpDescription",
      },
    ]
  },
]
