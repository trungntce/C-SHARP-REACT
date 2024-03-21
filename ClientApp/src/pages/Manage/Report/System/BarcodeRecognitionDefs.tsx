import { useTranslation } from "react-i18next";
import { currencyFormat, dateFormat, devideFormat } from "../../../../common/utility";

export const columnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_DUPLICATION"), // 중복
      field: "chk",
      maxWidth: 100,
      cellStyle: {textAlign: 'center'}, 
      cellRenderer: (d: any) => {
        if(d.data.chk == "CHK") {
          return (<div style={{ backgroundColor : "yellow" }}>V</div>);
        }else {
          return "";
        }
      }
    },
    {
      headerName: t("@COL_DATE_TYPE2"),//"일자",
      field: "createDt",
      maxWidth: 130,
      valueFormatter: (d: any) => dateFormat(d.data.createDt, "YYYY-MM-DD HH:mm"),
    },
    // {
    //   headerName: "상태",
    //   field: "status",
    //   maxWidth: 60,
    //   cellStyle: (params:any) => {
    //     if(params.data["status"] == "RUN") {
    //       return { color: "blue"}
    //     }
    //   }
    // },
    {
      headerName: t("@COL_MODEL_NAME"),//"모델명",
      field: "modelName",
      minWidth: 200,
    },
    {
      headerName: "BATCH NO",
      field: "workorder",
      minWidth: 200,
      tooltipValueGetter: (d:any) => `${d.data.workorder}`
    },
    // {
    //   headerName: "MUTI BATCH NO",
    //   field: "workorderMulti",
    //   minWidth: 150,
    //   tooltipValueGetter: (d:any) => `${d.data.workorderMulti}`
    // },
    {
      headerName: t("@COL_OPERATION_SEQ_NO"),//"공정순서",
      field: "operSeqNo",
      maxWidth: 90,
    },
    {
      headerName: t("@COL_OPERATION_NAME"),//"공정명",
      field: "operDesc",
      minWidth: 200,
    },
    {
      headerName: "RTR/SHEET",
      field: "rtrSheet",
      maxWidth: 100,
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "eqpName",
      minWidth: 200,
    },
    // {
    //   headerName: t("@COL_EQP_NAME_MULTI"),//"다중 설비명",
    //   field: "eqpNameMulti",
    //   minWidth: 200,
    // },
    {
      headerName: t("@COL_BARCDOE"),//"바코드",
      field: "barcodeYn",
      maxWidth: 70,
    },
    {
      headerName: t("@COL_WORKCENTER_NAME"),//"작업장명",
      field: "workcenterDesc",
      minWidth: 200,
    },
    {
      headerName: `BATCH ${t("@STANDARD")} ${t("@COUNT")}`,//"BATCH 기준 수량",
      field: "erpCnt",
      type: 'rightAligned',
      maxWidth: 110,
      valueFormatter: (d:any) => currencyFormat(d.data.erpCnt)
    },
    {
      headerName: t("@BARCODE_RECOGNITION_QUANTITY_SUM"), //"바코드 인식 수량(합계)",
      field: "sumBarcodeCnt",
      type: 'rightAligned',
      maxWidth: 180,
      valueFormatter: (d:any) => currencyFormat(d.data.sumBarcodeCnt)
    },
    {
      headerName: t("@BARCODE_RECOGNITION_QUANTITY"), //"바코드 인식 수량",
      field: "barcodeCnt",
      type: 'rightAligned',
      maxWidth: 130,
      valueFormatter: (d:any) => currencyFormat(d.data.barcodeCnt)
    },
    {
      headerName: t("@BARCODE_RECOGNITION_RATE"), //"바코드 인식률",
      field: "barcodeReconize",
      type: 'rightAligned',
      maxWidth: 130,
      valueFormatter: (d:any) => {
        if(d.data.sumBarcodeCnt == 0 || d.data.erpCnt == 0) {
          return 0 + "%"
        }
        if(d.data.sumBarcodeCnt != 0 && d.data.erpCnt != 0){
          return devideFormat(d.data.sumBarcodeCnt, d.data.erpCnt);
        }
      },
    },
    {
      headerName: `MES ${t("@REGISTER_QUANTITY")}`, //"MES 등록 수량",
      field: "panelCnt",
      type: 'rightAligned',
      maxWidth: 120,
      valueFormatter: (d:any) => currencyFormat(d.data.panelCnt)
    },
    {
      headerName: "DATA LOSS율",
      field: "barcodeLossPer",
      type: 'rightAligned',
      maxWidth: 110,
      valueFormatter: (d:any) => {
        if(d.data.panelCnt == 0 || d.data.sumBarcodeCnt == 0) {
          return 0 + "%"
        }
        if(d.data.panelCnt != 0 && d.data.sumBarcodeCnt != 0){
          return (((d.data.sumBarcodeCnt - d.data.panelCnt)/d.data.sumBarcodeCnt) * 100 ).toFixed(2) + "%";
        }
      }
    },
    {
      headerName: `4m ${t("@COL_START")}`,//"4m 시작",
      field: "startDt",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.startDt, "YYYY-MM-DD HH:mm"),
    },
    {
      headerName: `4m ${t("@COL_END")}`,//"4M 종료",
      field: "endDt",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.endDt, "YYYY-MM-DD HH:mm"),
    },
    {
      headerName: t("@SCAN_START"), //"스캔 시작",
      field: "scanDtMin",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.scanDtMin, "YYYY-MM-DD HH:mm"),
    },
    {
      headerName: t("@SCAN_END"), //"스캔 종료",
      field: "scanDtMax",
      maxWidth: 150,
      valueFormatter: (d: any) => dateFormat(d.data.scanDtMax, "YYYY-MM-DD HH:mm"),
    },
    {
      headerName: `${t("@START_TIME_DIFFERENCE")}(${t("@MINUTE")})`, //"시작 시간 차이(분)",
      field: "startToMesMin",
      maxWidth: 250,
    },
    {
      headerName: `${t("@END_TIME_DIFFERENCE")}(${t("@MINUTE")})`, //"종료 시간 차이(분)",
      field: "endToMesMax",
      maxWidth: 250,
    },
  ]
}