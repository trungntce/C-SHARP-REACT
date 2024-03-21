import { Dictionary } from "../../common/types";
import { dateFormat, getLang, getLangAll } from "../../common/utility";

export const paramNgDefs = (): Dictionary[] => {
  return [
    {
      headerName: "시작시간",
      field: "eqpStartDt",
      width: 120,
      valueFormatter: (d: any) =>
        dateFormat(d.data.eqpStartDt, "MM-DD HH:mm:ss") ||
        dateFormat(d.data.eqpMinDt, "MM-DD HH:mm:ss"),
    },
    {
      headerName: "종료시간",
      field: "eqpEndDt",
      width: 120,
      valueFormatter: (d: any) =>
        dateFormat(d.data.eqpEndDt, "MM-DD HH:mm:ss") ||
        dateFormat(d.data.eqpMaxDt, "MM-DD HH:mm:ss"),
    },
    {
      headerName: "공정코드",
      field: "operCode",
      width: 100,
      tooltipValueGetter: (d: any) => d.data.operCode,
    },
    {
      headerName: "공정명",
      field: "operDescription",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.operDescriptionNg,
    },
    {
      headerName: "CTQ",
      field: "ctqYn",
      width: 55,
      cellRenderer: (d: any) => {
        if (d.data.ctqYn == "Y") {
          return <span className="badge bg-danger cell-ctq">CTQ</span>;
        } else {
          return "";
        }
      },
    },
    {
      headerName: "설비명",
      field: "eqpName",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.eqpName,
    },
    {
      headerName: "PV",
      field: "paramName",
      width: 400,
      tooltipValueGetter: (d: any) => d.data.paramName,
      valueFormatter: (d: any) => getLang(d.data.paramName),
    },
    {
      headerName: "LCL",
      field: "lcl",
      width: 60,
    },
    {
      headerName: "UCL",
      field: "ucl",
      width: 60,
    },
    {
      headerName: "LSL",
      field: "lsl",
      width: 60,
    },
    {
      headerName: "USL",
      field: "usl",
      width: 60,
    },
    {
      headerName: "측정",
      field: "eqpVal",
      width: 120,
      cellRenderer: (d: any) => {
        if (d.data.eqpMinVal == "-9999999999.999" && d.data.eqpMinVal == "-9999999999.999") {
          return "0 ~ 0";
        } else {
          return d.data.eqpMinVal + " ~ " + d.data.eqpMaxVal;
        }
      },
    },
    {
      headerName: "모델명",
      field: "modelDescription",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.modelDescription,
    },
    {
      headerName: "Affect Batch",
      field: "workorder",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.workorder,
    },
    {
      headerName: "Affect PNL",
      field: "panelId",
      width: 220,
      tooltipValueGetter: (d: any) => d.data.panelId,
    },
  ];
};

export const spcErrorDefs = (): Dictionary[] => {
  return [
    {
      headerName: "시작시간",
      field: "inspDt",
      width: 120,
      valueFormatter: (d: any) => d.data.inspDt,
    },
    {
      headerName: "공정명",
      field: "operDescription",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.operDescription,
    },
    {
      headerName: "CTQ",
      field: "ctqFlag",
      width: 55,
      cellRenderer: (d: any) => {
        if (d.data.ctqFlag == "Y") {
          return <span className="badge bg-danger cell-ctq">CTQ</span>;
        } else {
          return "";
        }
      },
    },
    {
      headerName: "설비명",
      field: "eqpName",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.eqpName,
    },
    {
      headerName: "NG 항목",
      field: "ngDescription",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.ngDescription,
    },
    {
      headerName: "모델명",
      field: "modelDescription",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.modelDescription,
    },
    {
      headerName: "Affect Batch",
      field: "workorder",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.workorder,
    },
    {
      headerName: "Affect PNL",
      field: "panelId",
      width: 200,
      tooltipValueGetter: (d: any) => d.data.panelId,
    },
    {
      headerName: "고객Min",
      field: "custMin",
      width: 80,
      valueFormatter: ({ value }: any) => value.toFixed(4),
    },
    {
      headerName: "고객Max",
      field: "custMax",
      width: 80,
      valueFormatter: ({ value }: any) => value.toFixed(4),
    },
    {
      headerName: "내부Min",
      field: "innerMin",
      width: 80,
      valueFormatter: ({ value }: any) => value.toFixed(4),
    },
    {
      headerName: "내부Max",
      field: "innerMax",
      width: 80,
      valueFormatter: ({ value }: any) => value.toFixed(4),
    },
    {
      headerName: "측정값",
      field: "inspVal",
      width: 80,
      valueFormatter: ({ value }: any) => value.toFixed(4),
    },
    {
      headerName: "판정",
      field: "csStatus",
      width: 80,
    },
  ];
};

export const analysisDefs = [
  {
    headerName: "발생시간",
    field: "spcTime",
    width: 120,
  },
  {
    headerName: "구분",
    field: "chmSection",
    width: 80,
  },
  {
    headerName: "공정명",
    field: "opClassDescription",
    width: 80,
  },
  {
    headerName: "CTQ",
    field: "ctqFlag",
    width: 55,
    cellRenderer: (d: any) => {
      if (d.data.ctqFlag == "★") {
        return <span className="badge bg-danger cell-ctq">CTQ</span>;
      } else {
        return "";
      }
    },
  },
  {
    headerName: "설비명",
    field: "equipmentDescription",
    width: 150,
  },
  {
    headerName: "코드명",
    field: "factorCode",
    width: 65,
  },
  {
    headerName: "약품명",
    field: "chemicalName",
    width: 80,
  },
  {
    headerName: "관리범위",
    field: "measureRange",
    width: 90,
  },
  {
    headerName: "측정Data",
    field: "spcValue",
    width: 100,
    valueFormatter: ({ value }: any) => value.toFixed(2),
  },
];
