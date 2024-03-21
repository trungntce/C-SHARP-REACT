import { ColDef } from "ag-grid-community";
import {  dateFormat, devideFormat, currencyFormat } from "../../../common/utility";

export const ngTypes = [
  { headerName: "None"            , field: "none" }
, { headerName: "Open"        , field: "open" }
, { headerName: "Short"        , field: "short" }
, { headerName: "Khuyết 손상"        , field: "khuyet" }
, { headerName: "Khuyết phần trên 상부손상" , field: "khuyetPhanTren" }
, { headerName: "Lồi 돌출" , field: "loi" }
, { headerName: "Foot"        , field: "foot" }
, { headerName: "Pit"         , field: "pit" }
, { headerName: "Dry film"         , field: "dryFilm" }
, { headerName: "Lệch Hole 홀터짐" , field: "lechHole" }
, { headerName: "Pin Hole" , field: "pinHole" }
, { headerName: "Mạ tắc Hole 홀막힘" , field: "maTacHole" }
, { headerName: "Nhăn 주름" , field: "nhan" }
, { headerName: "Biến màu 변색" , field: "bienMau" }
, { headerName: "Chấm đen 흑점" , field: "chamDen" }
, { headerName: "Quá ET 과에칭" , field: "quaEt" }
, { headerName: "Dị vật 이물" , field: "diVat" }
, { headerName: "Tenting" , field: "tenting" }
, { headerName: "GAI ĐỒNG 돌기" , field: "gaiDong" }
, { headerName: "Ngấm dung dịch 액터짐" , field: "ngamDungDich" }
, { headerName: "Dimple" , field: "dimple" }
, { headerName: "Void" , field: "void" }
, { headerName: "CUP 동표면 이상" , field: "cup" }
, { headerName: "Tràn đồng 잔동" , field: "tranDong" }
, { headerName: "KHAC 기타" , field: "khac" }
];

const ngCols: ColDef<any>[] = [];
ngTypes.forEach( ng=> {
  const valueCol = {
    headerName: ng.headerName,
    headerClass: 'cell-header-group-4',
    children: [
      {headerName: "수량", field: ng.field, width: 70, headerClass: 'cell-header-group-5', valueFormatter: (d:any) => currencyFormat(d.data[ng.field]),filter: "agNumberColumnFilter"},
      {headerName: "기준DPU", field: ng.field + "Rate", width: 85, headerClass: 'cell-header-group-5', valueFormatter: (d:any) => d.data[ng.field + "Rate"], filter: "agNumberColumnFilter"},
      {headerName: "DPU", field: ng.field + "dpu", width: 70, headerClass: 'cell-header-group-5', valueFormatter: (d:any) => (d.data[ng.field] / d.data.panelQty).toFixed(2)?? 0, filter: "agNumberColumnFilter"},
      {headerName: "불량율", width: 70, headerClass: 'cell-header-group-5', valueFormatter: (d:any) => d.data.pcsTotal > 0 ? devideFormat(d.data[ng.field], d.data.pcsTotal) : 0, filter: "agNumberColumnFilter"},
    ]
  };

  ngCols.push(valueCol);
});

export const columnCountDefs = [
  {
    headerName: "제품 정보",
    headerClass: 'no-leftborder cell-header-group-1',
    cellStyle: {
      textAlign: 'center',
      width: '100%'
    },
    children: 
    [
      //{ field: "itemCode", headerName: "제품코드", width: 180, headerClass: "no-leftborder cell-header-group-2"},
      { field: "itemName", headerName: "제품명", width: 180, headerClass: "no-leftborder cell-header-group-2"},
      { field: "modelCode", headerName: "모델코드", width: 160, headerClass: "no-leftborder cell-header-group-2"},
      { field: "workorder", headerName: "BATCH", width: 180, headerClass: "no-leftborder cell-header-group-2"},
      { field: "appName", headerName: "공정명", width: 90, headerClass: "no-leftborder cell-header-group-2"},
      //{ field: "eqpCode", headerName: "장비코드", width: 180, headerClass: "no-leftborder cell-header-group-2"},
      { field: "eqpName", headerName: "장비명", width: 90, headerClass: "no-leftborder cell-header-group-2"},  
      // { field: "layer", headerName: "Layer", width: 80, headerClass: "no-leftborder cell-header-group-2",     
      //   cellRenderer: (d: any) => {
      //     if(!d.data || !d.data.layer)
      //       return '';
          
      //     return d.data.layer + "L";
      //   }},
    ]
  },
  {
    headerName: "검사수량",
    headerClass: 'cell-header-group-1 ',
    children: [
      {
      headerComponentParams: {
        template: '<div class="header-wrapper"><p></p>&nbsp;&nbsp;&nbsp;총 검사수랑<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(PCS)</p></div>',
      },
      resizable: false,
      field: "pcsTotal", headerClass: 'cell-header-group-2', width: 105, valueFormatter: (d:any) => d.data.pcsTotal > 0 ? currencyFormat(d.data.pcsTotal) : 0, filter: "agNumberColumnFilter"},
      {headerName: "PNL", field: "panelQty", headerClass: 'cell-header-group-2', width: 70, valueFormatter: (d:any) => currencyFormat(d.data.panelQty)?? 0, filter: "agNumberColumnFilter"},
      {
      headerComponentParams: {
        template: '<div class="header-wrapper"><p></p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;불량수량<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(PCS)</p></div>',
      },
      resizable: false,
      field: "ngPcsTotal", headerClass: 'cell-header-group-2', width: 100, valueFormatter: (d:any) => d.data.ngPcsTotal > 0 ? currencyFormat(d.data.ngPcsTotal) : 0, filter: "agNumberColumnFilter"},
    ]
  },
  {
    headerName: "불량율",
    headerClass: 'cell-header-group-1 ',
    children: [
      {headerName: "불량율", field: "ng_rate", headerClass: 'cell-header-group-2', width: 90, valueFormatter: (d:any) => d.data.pcsTotal > 0 ? devideFormat(d.data.ngPcsTotal, d.data.pcsTotal) : 0, filter: "agNumberColumnFilter"},
      //{headerName: "불량율", field: "ng_rate", headerClass: 'cell-header-group-2', width: 90, valueFormatter: (d:any) => d.data.pcsTotal > 0 ? devideFormat(d.data.ngCnt, d.data.pcsTotal) : 0, filter: "agNumberColumnFilter"},
      {headerName: "기준불량율", field: "stdRate", headerClass: 'cell-header-group-2', width: 100, valueGetter: (d:any) => d.data.stdRate, filter: "agNumberColumnFilter"},
      //{headerName: "PNL", field: "panelCnt", headerClass: 'cell-header-group-2', width: 70, valueFormatter: (d:any) => currencyFormat(d.data.panelCnt)?? 0, filter: "agNumberColumnFilter"},
      {headerName: "DEFECT 수", field: "ngCnt", headerClass: 'cell-header-group-2', width: 90, valueFormatter: (d:any) => d.data.ngCnt ? currencyFormat(d.data.ngCnt) : 0, filter: "agNumberColumnFilter"},
      //{headerName: "DPU", field: "defect_pnl", headerClass: 'cell-header-group-2', width: 90, valueFormatter: (d:any) => currencyFormat(d.data.ngCnt / d.data.panelCnt) ?? 0, filter: "agNumberColumnFilter"},
      {headerName: "DPU", field: "defect_pnl", headerClass: 'cell-header-group-2', width: 90, valueFormatter: (d:any) => d.data.panelQty > 0 ? (d.data.ngCnt / d.data.panelQty).toFixed(2) : 0, filter: "agNumberColumnFilter"},
    ]
  },
  {
    headerName: "불량항목",
    headerClass: 'cell-header-group-3 ',
    children: ngCols
  },
  {
    field: "mesdate",
    headerName: "MES일자",
    width: 100, 
    headerClass: "no-leftborder cell-header-group-2",
    cellRenderer: (d: any) => {
      if(!d.data || !d.data.mesdate)
        return '';

      if(d.data.mesdate.toUpperCase().indexOf("TOTAL") >= 0 || 
        d.data.mesdate.toUpperCase().indexOf("SUM") >= 0 || 
        d.data.mesdate.toUpperCase().indexOf("AMOUNT") >= 0)
        return ( <div className="text-center">{d.data.mesdate}</div> );  

      return dateFormat(d.data.mesdate, "YYYY-MM-DD")
    }
  },
  {
    field: "startDt",
    headerName: "4M등록 시간",
    width: 150, 
    headerClass: "no-leftborder cell-header-group-2",
    cellRenderer: (d: any) => {
      if(!d.data || !d.data.startDt)
        return '';

      if(d.data.startDt.toUpperCase().indexOf("TOTAL") >= 0 || 
        d.data.startDt.toUpperCase().indexOf("SUM") >= 0 || 
        d.data.startDt.toUpperCase().indexOf("AMOUNT") >= 0)
        return ( <div className="text-center">{d.data.startDt}</div> );  

      return dateFormat(d.data.startDt, "YYYY-MM-DD HH:mm:ss")
    }
  },
  {
    field: "endDt",
    headerName: "4M END 시간",
    width: 150, 
    headerClass: "no-leftborder cell-header-group-2",
    cellRenderer: (d: any) => {
      if(!d.data || !d.data.endDt)
        return '';

      if(d.data.endDt.toUpperCase().indexOf("TOTAL") >= 0 || 
        d.data.endDt.toUpperCase().indexOf("SUM") >= 0 || 
        d.data.endDt.toUpperCase().indexOf("AMOUNT") >= 0)
        return ( <div className="text-center">{d.data.endDt}</div> );  

      return dateFormat(d.data.endDt, "YYYY-MM-DD HH:mm:ss")
    }
  },
]

export const columnErrorDefs = [
  {
    field: "rowId",
    headerName: "NO",
    headerClass: 'cell-header-group-1',
    width: 60,
  },
  {
    field: "pnlId",
    headerName: "PNL ID",
    headerClass: 'cell-header-group-1',
    width: 180,
  },
  {
    field: "pnl_ng_rate",
    headerName: "PNL불량율",
    headerClass: 'cell-header-group-1',
    width: 120,
    valueFormatter: (d:any) => d.data.pcsTotal > 0 ? devideFormat(d.data.totalNg, d.data.pcsTotal) : '0.00%',
    filter: "agNumberColumnFilter",
  },
  {
    field: "worst_dpu",
    headerName: "DPU",
    headerClass: 'cell-header-group-1',
    width: 80,
    valueFormatter: (d:any) => (d.data.totalNg / 1)?? 0,
    filter: "agNumberColumnFilter",
  },
  {
    field: "worstName",
    headerName: "WORST 불량",
    headerClass: 'cell-header-group-1',
    width: 120,
  },
  {
    field: "worst_rate",
    headerName: "WORST 불량율",
    headerClass: 'cell-header-group-1',
    width: 120,
    valueFormatter: (d:any) => d.data.pcsTotal > 0 ? devideFormat(d.data.worstCnt, d.data.pcsTotal) : '0.00%',
    filter: "agNumberColumnFilter",
  },
  {
    field: "scanDt",
    headerName: "SCAN 시간",
    headerClass: 'cell-header-group-1',
    width: 150,
    cellRenderer: (d: any) => {
      if(!d.data || !d.data.scanDt)
        return ''

      return dateFormat(d.data.scanDt, "YYYY-MM-DD HH:mm:ss")
    }
  },
]


export const columnDetailDefs = [
  {
    field: "rowId",
    headerName: "NO",
    headerClass: 'cell-header-group-1',
    width: 60,
  },
  {
    field: "ngName",
    headerName: "불량항목",
    headerClass: 'cell-header-group-1',
    width: 90,
  },
  {
    field: "totalCnt",
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
    width: 100,
  },
  {
    field: "scanDt",
    headerName: "SCAN 시간",
    width: 150,
    cellRenderer: (d: any) => {
      if(!d.data || !d.data.scanDt)
        return ''

      return dateFormat(d.data.scanDt, "YYYY-MM-DD HH:mm:ss")
    }
  },
  {
    headerName: "설비 진행 이력",
    children: [
      {
        headerName: "공순",
        headerClass: 'cell-header-group-2',
        width: 100,
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