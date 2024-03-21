import { PopoverBody, PopoverHeader, Table, UncontrolledPopover } from "reactstrap";

import moment from "moment";
import { useTranslation } from "react-i18next";
import { dateFormat } from "../../common/utility";

export const ColumnDefs = () => {
  const { t } = useTranslation();
  return [
  {
      headerName: t("공순"),  //"공정순서",
      field: "operSeqNo",
      width: 95,
  },
  {
      headerName: t("@COL_OPERATION_CODE"),  //"공정코드",
      field: "operCode",
      width: 110,
  },
    {
      headerName: t("@COL_OPERATION_NAME"),  //"공정코드",
      field: "operDesc",
      width: 195,
    },
    {
      headerName: t("@WCNAME"),  //"공정코드",
      field: "workcenterDesc",
      width: 195,
    },
    {
      headerName: t('@MATERIAL'),   //자재
      field: "materialYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="materialYn"
            defaultValue={d.data["materialYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("materialYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    },
    {
      headerName: 'TOOL',   
      field: "toolYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="toolYn"
            defaultValue={d.data["toolYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("toolYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    },  
    {
      headerName: t("@WORKER"),   //작업자
      field: "workerYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="workerYn"
            defaultValue={d.data["workerYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("workerYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    }, 
   
    {
      headerName: t("@SAMPLING_INSPECTION"),  //샘플링 검사
      field: "samplingYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="samplingYn"
            defaultValue={d.data["samplingYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("samplingYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    },
    {
      headerName: t("@TOTAL_INSPECTION"),
      field: "totalInspYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="totalInspYn"
            defaultValue={d.data["totalInspYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("totalInspYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    }, 
    {
      headerName: "SPC",
      field: "spcYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="spcYn"
            defaultValue={d.data["spcYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("spcYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    }, 
    {
      headerName: "Q-TIME",
      field: "qtimeYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="qtimeYn"
            defaultValue={d.data["qtimeYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("qtimeYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    }, 
    {
      headerName: t("@CHEM"),
      field: "chemYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="chemYn"
            defaultValue={d.data["chemYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("chemYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    }, 
    {
      headerName: "SV",
      field: "recipeYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="recipeYn"
            defaultValue={d.data["recipeYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("recipeYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    }, 
    {
      headerName: "PV",
      field: "paramYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="paramYn"
            defaultValue={d.data["paramYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("paramYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    }, 
    {
      headerName: "PANEL",
      field: "panelYn",
      width: 83,
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        return (
          <select
            name="panelYn"
            defaultValue={d.data["panelYn"]}
            onChange={(event: any) => {
              d.node.setDataValue("panelYn", event.target.value);
            }}
            className="form-select"
          >
            <option value="Y">{'Y'}</option> 
            <option value="N">{'N'}</option>
          </select>
        );
      },
    }, 
    {
      field: "rowNo",
      headerName: 'rowNo',  //"검사일",
      maxWidth: 125,
      hide:true
    },
  ]
};
