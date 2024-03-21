import { ColDef } from "ag-grid-community";
import { el } from "date-fns/locale";
import { dateFormat } from "../../../common/utility";
import { toComma } from "../../AnyPage/utills/toComma";

export const parameterDefs: ColDef[] = [
  {
    headerName: "발생시간",
    field: "eqpMaxDt",
    maxWidth: 100,
    valueFormatter: (d: any) => dateFormat(d.data.eqpMaxDt, "HH:mm"),
  },
  {
    headerName: "구분",
    field: "gubun",
    maxWidth: 70,
    valueFormatter: (d: any) => "PV",
  },
  {
    headerName: "공정명",
    field: "operDescription",
    // maxWidth: 220,
    flex: 1.7,
  },
  {
    headerName: "설비명",
    field: "eqpName",
    // maxWidth: 190,
    flex: 2,
  },
  {
    headerName: "LCL",
    field: "lcl",
    maxWidth: 70,
  },
  {
    headerName: "UCL",
    field: "ucl",
    maxWidth: 70,
  },
  {
    headerName: "LSL",
    field: "lsl",
    maxWidth: 70,
  },
  {
    headerName: "UCL",
    field: "usl",
    maxWidth: 70,
  },
  {
    headerName: "측정",
    field: "eqpVal",
    maxWidth: 100,
    valueFormatter: (d: any) => {
      return d.data.eqpMinVal + "~" + d.data.eqpMaxVal;
    },
  },
  {
    headerName: "Affect BATCH",
    field: "workorder",
    maxWidth: 240,
  },
  // {
  //   headerName: "Affect PNL",
  //   field: "panelId",
  //   maxWidth: 200,
  // },
];

export const IPQCDeffectDefs: ColDef[] = [
  // {
  //   headerName: "No",
  //   field: "rowNum",
  //   maxWidth: 70,
  // },
  {
    headerName: "발생시간",
    field: "inspectionTime",
    maxWidth: 100,
  },
  {
    headerName: "공정명",
    field: "operationDescription",
    maxWidth: 120,
  },
  {
    headerName: "구분",
    field: "itemSectionDesc",
    maxWidth: 70,
  },
  {
    headerName: "모델명",
    field: "bomItemDescription",
    maxWidth: 300,
    resizable: true,
  },
  {
    headerName: "불량명",
    field: "rejectDesc",
    maxWidth: 280,
    resizable: true,
  },
  {
    headerName: "불량률",
    field: "rejectRate",
    maxWidth: 90,
    cellRenderer: (d: any) => d.data.rejectRate + "%",
    cellStyle: (params: any) => {
      return {
        fontSize: "15px",
        "background-color": "#D93D3D",
        fontWeight: "bold",
      };
    },
  },
  {
    headerName: "모델코드",
    field: "bomItemCode",
    maxWidth: 220,
  },
  {
    headerName: "BATCH No",
    field: "jobNo",
    maxWidth: 220,
  },
];

export const SPCDefs: ColDef[] = [
  // {
  //   headerName: "No",
  //   field: "ROW_NUM",
  //   maxWidth: 80,
  // },
  {
    headerName: "발생시간",
    field: "inspectionTime",
    maxWidth: 100,
  },
  {
    headerName: "공정명",
    field: "operationDescription",
    maxWidth: 170,
  },
  {
    headerName: "모델명",
    field: "bomItemDescription",
    resizable: true,
    maxWidth: 350,
  },
  {
    headerName: "NG 항목",
    field: "ngDescription",
    maxWidth: 100,
  },
  {
    headerName: "하한",
    field: "innerStandardMin",
    maxWidth: 80,
    valueFormatter: ({ value }: any) => value.toFixed(4),
  },
  {
    headerName: "상한",
    field: "innerStandardMax",
    maxWidth: 80,
    valueFormatter: ({ value }: any) => value.toFixed(4),
  },
  {
    headerName: "측정Data",
    field: "valueNg",
    maxWidth: 120,
    valueFormatter: ({ value }: any) => value.toFixed(4),
    cellStyle: (params: any) => {
      var minVal = params.data["innerStandardMin"];
      var maxVal = params.data["innerStandardMax"];
      var targetVal = params.data["valueNg"];

      if (targetVal < minVal) {
        return {
          fontSize: "17px",
          "background-color": "#D93D3D",
          fontWeight: "bold",
        };
      }
      if (targetVal > maxVal) {
        return {
          fontSize: "17px",
          "background-color": "#0F8DBF",
          fontWeight: "bold",
        };
      }
      // if(targetVal > minVal && targetVal < maxVal)
      // {
      //   return {fontSize: "17px"}
      // }
    },
  },
  {
    headerName: "모델코드",
    field: "bomItemCode",
    maxWidth: 200,
  },
  {
    headerName: "BATCH No",
    field: "jobNo",
    maxWidth: 240,
  },
  {
    headerName: "Affect PNL",
    field: "affectPnl",
    maxWidth: 120,
  },
  {
    headerName: "기준",
    field: "",
    maxWidth: 100,
  },
];

export const analysisDefs = [
  {
    headerName: "발생시간",
    field: "spcTime",
    type: "leftAligned",
    flex: 0.8,
  },
  {
    headerName: "구분",
    field: "chmSection",
    type: "leftAligned",
    flex: 0.7,
  },
  {
    headerName: "공정명",
    field: "opClassDescription",
    type: "leftAligned",
    flex: 1,
  },
  {
    headerName: "설비명",
    field: "equipmentDescription",
    type: "leftAligned",
    flex: 1.6,
    resizable: true,
  },
  {
    headerName: "코드명",
    field: "factorCode",
    type: "leftAligned",
    flex: 0.7,
  },
  {
    headerName: "약품명",
    field: "chemicalName",
    type: "leftAligned",
    flex: 0.8,
  },
  {
    headerName: "관리범위",
    field: "measureRange",
    type: "leftAligned",
    flex: 1.3,
    resizable: true,
    headerComponentParams: {
      template: '<div class="header-wrapper">관리범위</div>',
    },
    suppressMovable: true,
  },
  {
    headerName: "측정Data",
    field: "spcValue",
    type: "leftAligned",
    flex: 1,
    valueFormatter: ({ value }: any) => value.toFixed(2),
    cellStyle: (params: any) => {
      var avgVal = params.data["measureRange"]
        .split("±")
        .map((item: any) => parseFloat(item))[0];
      var chgVal = params.data["measureRange"]
        .split("±")
        .map((item: any) => parseFloat(item))[1];

      var minVal = avgVal - chgVal;
      var maxVal = avgVal + chgVal;
      var targetVal = params.data["spcValue"];

      if (targetVal < minVal) {
        return {
          fontSize: "17px",
          "background-color": "#D93D3D",
          fontWeight: "bold",
        };
      }
      if (targetVal > maxVal) {
        return {
          fontSize: "17px",
          "background-color": "#0F8DBF",
          fontWeight: "bold",
        };
      }

      // return {fontSize: "17px", 'background-color': '#D93D3D', fontWeight: 'bold'}
    },
  },
];
