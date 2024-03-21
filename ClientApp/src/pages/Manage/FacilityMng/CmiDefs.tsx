import { useTranslation } from "react-i18next";

export const columnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@OPERATION"), //"공정",
      field: "process",
      maxWidth: 350,
    },
    {
      headerName: t("@EQP_UNIT"), //"호기",
      field: "machineNumber",
      maxWidth: 100,
    },
    {
      headerName: "STD",
      field: "std",
      maxWidth: 100,
    },
    {
      headerName: "LSL",
      field: "lcl",
      maxWidth: 100,
    },
    {
      headerName: "USL",
      field: "ucl",
      maxWidth: 100,
    },
    {
      headerName: "DO LECH",
      field: "dolech",
      maxWidth: 100,
      type: 'rightAligned', 
    },
    {
      headerName: "MIN",
      field: "minThick",
      maxWidth: 100,
      type: 'rightAligned', 
    },
    {
      headerName: "MAX",
      field: "maxThick",
      maxWidth: 100,
      type: 'rightAligned', 
    },
    {
      headerName: "AVG",
      field: "avgThick",
      maxWidth: 100,
      type: 'rightAligned', 
    },
    // {
    //   headerName: "CPK",
    //   field: "cpk",
    //   maxWidth: 100,
    //   type: 'rightAligned', 
    // },
  ]
};

export const columnRawDefs = () => {
  const { t } = useTranslation();

  return [
    {
      headerName: "NO",
      field: "seq",
      maxWidth: 100,
    },
    {
      headerName: t("@DATE"), //"날짜",
      field: "fac_id",
      maxWidth: 100,
    },
    {
      headerName: t("@MEASUREMENT_START"), //"측정시작",
      field: "startDt",
      maxWidth: 500,
    },
    {
      headerName: t("@MEASUREMENT_END"), //"측정종료",
      field: "endDt",
      maxWidth: 500,
    },
    {
      headerName: `${t("@LINE")}ID`, //"라인ID",
      field: "lineId",
      maxWidth: 100,
    },
    {
      headerName: t("@MEASURING_INSTRUMENT"), //"측정기",
      field: "equipmentId",
      maxWidth: 250,
    },
    {
      headerName: t("@COL_EQP_NAME"), //"설비명",
      field: "equipmentName",
      maxWidth: 250,
    },
    {
      headerName: t("@MEASURER"), //"측정자",
      field: "person",
      maxWidth: 100,
    },
    {
      headerName: t("@WORKING_GROUP"), //"작업조",
      field: "team",
      maxWidth: 100,
    },
    {
      headerName: t("@COL_MODEL_CODE"), //"모델코드",
      field: "modelCode",
      maxWidth: 250,
    },
    {
      headerName: t("@COL_MODEL_NAME"), //"모델명",
      field: "modelName",
      maxWidth: 250,
    },
    {
      headerName: "BATCH NO",
      field: "lotNumber",
      maxWidth: 250,
    },
    {
      headerName: t("@INPUT_COUNT"), //"투입수",
      field: "inputDo",
      maxWidth: 100,
    },
    {
      headerName: t("@EQP_UNIT"), //"호기",
      field: "machineNumber",
      maxWidth: 100,
    },
    {
      headerName: "Process",
      field: "process",
      maxWidth: 100,
    },
    {
      headerName: t("@LAYUP"), //"적층",
      field: "layer",
      maxWidth: 100,
    },
    {
      headerName: `SPEC(${t("@COL_VENDOR_NAME")})`, //"SPEC(고객사)",
      field: "spec",
      maxWidth: 100,
    },
    {
      headerName: `USL(${t("@COL_VENDOR_NAME")})`, //"USL(고객사)",
      field: "ucl",
      maxWidth: 100,
    },
    {
      headerName: `LSL(${t("@COL_VENDOR_NAME")})`, //"LSL(고객사)",
      field: "lcl",
      maxWidth: 100,
    },
    {
      headerName: t("@FINAL_JUDGMENT"), //"최종판정",
      field: "specResult",
      maxWidth: 100,
      cellClass: (d:any) => {
        if(d.data.specResult === "NG")
          return "cell-red";
      }
    },
    {
      headerName: `USL${t("@COL_INTERNAL")}`, //"USL(내부)",
      field: "ucl2",
      maxWidth: 100,
    },
    {
      headerName: `LSL${t("@COL_INTERNAL")}`, //"LSL(내부)",
      field: "lcl2",
      maxWidth: 100,
    },
    {
      headerName: t(""), //"종류",
      field: "phanloai",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}1`, //"측정값1",
      field: "p1",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}2`, //"측정값2",
      field: "p2",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}3`, //"측정값3",
      field: "p3",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}4`, //"측정값4",
      field: "p4",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}5`, //"측정값5",
      field: "p5",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}6`, //"측정값6",
      field: "p6",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}7`, //"측정값7",
      field: "p7",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}8`, //"측정값8",
      field: "p8",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}9`, //"측정값9",
      field: "p9",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}10`, //"측정값10",
      field: "p10",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}11`, //"측정값11",
      field: "p11",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}12`, //"측정값12",
      field: "p12",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}13`, //"측정값13",
      field: "p13",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}14`, //"측정값14",
      field: "p14",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}15`, //"측정값15",
      field: "p15",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}16`, //"측정값16",
      field: "p16",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}17`, //"측정값17",
      field: "p17",
      maxWidth: 100,
    },
    {
      headerName: `${t("@MEASURED_VALUE")}18`, //"측정값18",
      field: "p18",
      maxWidth: 100,
    },
    {
      headerName: t("@MAX_MIN_DIFFERENCE"), //"최대최소차이값",
      field: "dolech",
      maxWidth: 100,
    },
    {
      headerName: "MAX",
      field: "maxThick",
      maxWidth: 100,
    },
    {
      headerName: "MIN",
      field: "minThick",
      maxWidth: 100,
    },
    {
      headerName: "AVG",
      field: "avgThick",
      maxWidth: 100,
    },
    // {
    //   headerName: "CPK",
    //   field: "cpk",
    //   maxWidth: 100,
    // },
    // {
    //   headerName: "CPK Check",
    //   field: "cpkCheck",
    //   maxWidth: 100,
    // },
    {
      headerName: t("@REMARKS"), //"비고",
      field: "remark",
      maxWidth: 100,
    },
    {
      headerName: t("@APPLICATION_DATE"), //"적용일자",
      field: "extend_dt",
      maxWidth: 100,
    },
  
  
  ]
};
