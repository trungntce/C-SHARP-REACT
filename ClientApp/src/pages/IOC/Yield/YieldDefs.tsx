import { ColDef } from "ag-grid-community";
import { dateFormat, devideFormat, currencyFormat } from "../../../common/utility";
import { toComma } from "../../AnyPage/utills/toComma";
import myStyle from "./Yield.module.scss"

export const diffDefs = [
  {
    headerName: "등급",
    field: "entryDescription",
    type: "leftAligned",
    maxWidth: 90,
    resizable: true,
    cellStyle: {fontSize: "18px"},
    filter: true,
  },
  {
    headerName: "제품명",
    field: "bomItemDescription",
    type: "leftAligned",
    flex: 2.6,
    resizable: true,
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "투입 수율",
    field: "yieldRateConfirm",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) =>  (d.data.yieldRateConfirm ? d.data.yieldRateConfirm : 0) + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "월간 수율",
    field: "monthYieldRate",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => (d.data.monthYieldRate ? d.data.monthYieldRate : 0) + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "전일 수율",
    field: "yesterdayYieldRate",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => (d.data.yesterdayYieldRate ? d.data.yesterdayYieldRate : 0) + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "금일 수율",
    field: "todayYieldRate",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => (d.data.todayYieldRate ? d.data.todayYieldRate : 0) + ' %',
    cellStyle:(params: any) => {
      return {fontSize: "18px", borderRight: "1px solid white"}
    },
  },
  {
    headerName: "FQC수율",
    field: "todayFqcYieldRate",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => (d.data.todayFqcYieldRate ? d.data.todayFqcYieldRate : 0) + ' %',
    cellStyle: {fontSize: "18px"},
  },
  {
    headerName: "BBT수율",
    field: "todayBbtYieldRate",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => (d.data.todayBbtYieldRate ? d.data.todayBbtYieldRate : 0) + ' %',
    cellStyle: {fontSize: "18px"},
  },

]

export const aoiMainDefs = [
  {
    headerName: "제품코드",
    field: "bomItemCode",
    type: "leftAligned",
    flex: 2.2,
    resizable: true,
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "제품명",
    field: "bomItemDescription",
    type: "leftAligned",
    flex: 1.9,
    resizable: true,
    cellStyle: {fontSize: "18px"}
  },
  {
    type: "rightAligned",
    flex: 0.8,
    resizable: true,
    cellStyle: {fontSize: "18px"},
    headerComponentParams: {
      template: '<div class="header-wrapper">검사층</div>',
    },
    suppressMovable: true,
  },
  {
    field: "rateMonth",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    cellStyle: {fontSize: "18px"},
    headerComponentParams: {
      template: '<div class="header-wrapper">월간 수율</div>',
    },
    suppressMovable: true,
    valueFormatter: ({ value }: any) => `${value ? toComma(value) : 0} %`,
  },
  {
    field: "rateToday",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    cellStyle:(params: any) => {
      return {fontSize: "18px", borderRight: "1px solid white"}
    },
    headerComponentParams: {
      template: '<div class="header-wrapper">금일 수율</div>',
    },
    suppressMovable: true,
    valueFormatter: ({ value }: any) => `${value ? toComma(value) : 0} %`,
  },
  {
    headerName: "OPEN",
    field: "openDefactQtyToday",
    type: "rightAligned",
    flex: 0.9,
    resizable: true,
    valueFormatter: (d: any) => d.data.openDefactQtyToday + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "SHORT",
    field: "shortDefactQtyToday",
    type: "rightAligned",
    flex: 0.9,
    resizable: true,
    valueFormatter: (d: any) => d.data.shortDefactQtyToday + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "ETC",
    field: "etcDefactQtyToday",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => d.data.etcDefactQtyToday + ' %',
    cellStyle: {fontSize: "18px"}
  },
];

export const aoiListDefs = [
  {
    headerName: "등급",
    field: "grade",
    type: "leftAligned",
    maxWidth: 90,
    resizable: true,
    cellStyle: {fontSize: "18px"},
    filter: true
  },
  // {
  //   field: "bomItemCode",
  //   type: "leftAligned",
  //   maxWidth: 250,
  //   resizable: true,
  //   headerComponentParams: {
  //     template: '<div class="header-wrapper">제품코드</div>',
  //   },
  //   cellStyle: {fontSize: "18px"}
  // },
  {
    headerName: "제품명",
    field: "bomItemDescription",
    type: "leftAligned",
    maxWidth: 350,
    resizable: true,
    cellStyle: {fontSize: "18px"}
  },
  {
    type: "rightAligned",
    field: "layer",
    maxWidth: 100,
    resizable: true,
    cellStyle: {fontSize: "18px"},
    headerComponentParams: {
      template: '<div class="header-wrapper">검사층</div>',
    },
    suppressMovable: true,
  },
  {
    field: "rateMonth",
    type: "rightAligned",
    maxWidth: 120,
    resizable: true,
    cellStyle: {fontSize: "18px"},
    headerComponentParams: {
      template: '<div class="header-wrapper">월간 수율</div>',
    },
    suppressMovable: true,
    valueFormatter: ({ value }: any) => `${value ? toComma(value) : 0} %`,
  },
  {
    field: "rateYesterday",
    type: "rightAligned",
    maxWidth: 120,
    resizable: true,
    cellStyle: {fontSize: "18px"},
    headerComponentParams: {
      template: '<div class="header-wrapper">전일 수율</div>',
    },
    suppressMovable: true,
    valueFormatter: ({ value }: any) => `${value ? toComma(value) : 0} %`,
  },
  {
    field: "rateToday",
    type: "rightAligned",
    maxWidth: 120,
    resizable: true,
    cellStyle:(params: any) => {
      return {fontSize: "18px", borderRight: "1px solid white"}
    },
    headerComponentParams: {
      template: '<div class="header-wrapper">금일 수율</div>',
    },
    suppressMovable: true,
    valueFormatter: ({ value }: any) => `${value ? toComma(value) : 0} %`,
  },
  {
    headerName: "OPEN",
    field: "openDefactQtyToday",
    type: "rightAligned",
    maxWidth: 120,
    resizable: true,
    valueFormatter: (d: any) => d.data.openDefactQtyToday + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "SHORT",
    field: "shortDefactQtyToday",
    type: "rightAligned",
    maxWidth: 100,
    resizable: true,
    valueFormatter: (d: any) => d.data.shortDefactQtyToday + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "ETC",
    field: "etcDefactQtyToday",
    type: "rightAligned",
    maxWidth: 100,
    resizable: true,
    valueFormatter: (d: any) => d.data.etcDefactQtyToday + ' %',
    cellStyle: {fontSize: "18px"}
  },
];

export const bbtDefs = [
  {
    headerName: "등급",
    field: "grade",
    type: "leftAligned",
    maxWidth: 90,
    resizable: true,
    cellStyle: {fontSize: "18px"},
    filter: true
  },
  {
    headerName: "제품명",
    field: "modelDescription",
    type: "leftAligned",
    flex: 2.4,
    resizable: true,
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "월간 수율",
    field: "monthYield",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => d.data.monthYield + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "전일 수율",
    field: "yesterdayYield",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => d.data.weekYield + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "금일 수율",
    field: "dayYield",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => d.data.dayYield + ' %',
    cellStyle:(params: any) => {
      return {fontSize: "18px", borderRight: "1px solid white"}
    },
  },
  {
    headerName: "OPEN",
    field: "openYield",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => d.data.openYield + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "SHORT",
    field: "shortYield",
    type: "rightAligned",
    flex: 1,
    resizable: true,
    valueFormatter: (d: any) => d.data.shortYield + ' %',
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "Sus접지저항",
    field: "shortDefactQtyToday",
    type: "rightAligned",
    flex: 1.2,
    resizable: true,
    valueFormatter: (d: any) => d.data.shortDefactQtyToday,
    cellStyle: {fontSize: "18px"}
  },
  {
    headerName: "기타",
    field: "",
    type: "rightAligned",
    // valueFormatter: (d: any) => (d.data.diff.toFixed(2) + ' %'),
    flex: 1,
    resizable: true,
    cellStyle: {fontSize: "18px"}
  },
];
