import moment from "moment";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";
import { Dictionary } from "../../common/types";
import { dateFormat, getLang, getLangAll } from "../../common/utility";
import Select from "../../components/Common/Select";
import { checkCol } from "./OperExtDefs";

export const modelColumnDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_MODEL_CODE"), //모델코드
      field: "modelCode",
      flex: 1.6,
    },
    {
      headerName: t("@COL_MODEL_NAME"), //모델명
      field: "modelDescription",
      flex: 1.8,
    },
    // {
    //   headerName: t("@COL_SETTING"), //설정
    //   field: "setupYn",
    //   flex: 1.2,
    // },
    {
      headerName: t("@APPROVAL_STATUS"), //승인여부
      flex: 1.8,
      valueFormatter: (d: any) => getLang(d.data.codeName),
    },
  ];
};

export const operColumnDefs = () => {
  const { t } = useTranslation();

  return [
    {
      headerName: t("@COL_OPERATION_INFO"), //공정정보
      headerClass: "no-leftborder",
      children: [
        {
          headerName: t("@COL_OPERATION_SEQ_NO"), //공정순서
          headerClass: "no-leftborder",
          field: "operationSeqNo",
          flex: 1.5,
        },
        {
          headerName: t("@COL_OPERATION_CODE"), //공정코드
          headerClass: "no-leftborder",
          field: "operationCode",
          flex: 1.5,
        },
        // {
        //   headerName: t("@COL_OPERATION_NAME"), //공정명
        //   field: "operationDesc",
        //   flex: 3,
        // },
        {
          headerName: t("@COL_OPERATION_NAME"), //공정명
          field: "tranLang",
          flex: 5,
          valueFormatter: (d: any) => getLang(d.data.tranLang),
        },
        {
          headerName: t("@COL_OPERATION_DIVISION"), //공정구분
          field: "operYn",
          flex: 1.5,
          cellStyle: { textAlign: "center" },
          cellClass: "cell-combo-container",
          filter: false,
          cellRenderer: (d: any) => {
            return (
              <select
                name="operYn"
                defaultValue={d.data["operYn"]}
                onChange={(event: any) => {
                  d.node.setDataValue("operYn", event.target.value);
                }}
                className="form-select"
              >
                <option value="N">{`${t("@UNUSED")}`}</option> 
                <option value="Y">{`${t("@REQUIRED_OPERATION")}`}</option>
                <option value="O">{`${t("@SELECTION_OPERATION")}`}</option>
              </select>
            );
          },
        },
      ],
    },
    // {
    //   headerName: "4M스캔",
    //   children: [
    //     //checkCol("작업자", "scanWorkerYn"),
    //     //checkCol("자재", "scanMaterialYn"),
    //     //
    //   ]
    // },
    // {
    //   headerName: "시작종료여부",
    //   children: [
    //     checkCol("시작", "startYn"),
    //     checkCol("종료", "endYn"),
    //   ]
    // },
    {
      headerName: t("@COL_OPERATION_SETTING"), //공정설정
      children: [
        checkCol(t("@COL_EQUIPMENT"), "scanEqpYn"), //설비
        checkCol(t("@COL_TOOL"), "scanToolYn"), //툴
        checkCol(t("@COL_SPEED_SCAN"), "scanPanelYn"), //고속스캔
        {
          headerName: t("@COL_BARCODE_DIVISION"), //바코드구분
          field: "scanType",
          flex: 1.6,
          cellClass: "cell-combo-container cell-combo-disable",
          cellRenderer: (d: any) => {
            return (
              <select
                name="scanType"
                placeholder={`${t("@COL_BARCODE_DIVISION")}`} //바코드구분
                className="form-select"
                defaultValue={d.data["scanType"] || "P"}
                onChange={(event: any) => {
                  d.node.setDataValue("scanType", event.target.value);
                }}
              >
                <option value="R">ROLL</option>
                <option value="P">PANEL</option>
                <option value="C">PCS</option>
                <option value="S">SHEET</option>
              </select>
            );
          },
        },
        {
          headerName: t("@COL_REWORK_DIVISION"), //재처리구분
          field: "reworkYn",
          flex: 1.6,
          cellClass: "cell-combo-container cell-combo-disable",
          cellRenderer: (d: any) => {
            return (
              <select
                name="reworkYn"
                defaultValue={d.data["reworkYn"]}
                onChange={(event: any) => {
                  d.node.setDataValue("reworkYn", event.target.value);
                }}
                className="form-select"
              >
                <option value="N">{`${t("@REWORK_ALLOW")}`}</option>
                <option value="Y">{`${t("@APPROVAL_REQUIRED")}`}</option>
                <option value="O">{`${t("@REWORK_IMPOSSIBLE")}`}</option>
              </select>
            );
          },
        },
        //checkCol("분할", "splitYn"),
        checkCol("LAYUP", "mergeYn"),
      ],
    },
  ];
};

export const eqpColumnDefs = () => {
  const { t } = useTranslation();

  return [
    {
      headerName: t("@COL_EQP_CODE"), //설비코드
      field: "eqpCode",
      maxWidth: 160,
      headerCheckboxSelection: true,
      checkboxSelection: true,
    },
    {
      headerName: t("@COL_EQP_NAME"), //설비명
      field: "eqpDesc",
      maxWidth: 230,
    },
    {
     headerName: t("@COL_EQP_LOCATION"), //설비위치
     field: "eqpLocation",
     maxWidth: 230,
   },
    {
      headerName: t("@COL_WORKCENTER_CODE"), //작업장코드
      field: "workcenterCode",
      maxWidth: 120,
    },
    {
      headerName: t("@COL_WORKCENTER_NAME"), //작업장명
      field: "workcenterDesc",
      maxWidth: 180,
    },
  ];
};
