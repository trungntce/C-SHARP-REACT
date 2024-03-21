import {
  ICellRendererParams,
  IHeaderParams,
  RowSpanParams,
} from "ag-grid-community";
import { Button } from "reactstrap";
import { checkCol } from "../../OperExtDefs";
import { useTranslation } from "react-i18next";
import { getLang, getLangAll } from "../../../../common/utility";

export const checkboxHeader = (param: IHeaderParams) => {
  return (
    <div className="header-checkbox-container">
      <label>
        <input
          type="checkbox"
          defaultChecked={false}
          onClick={(event: any) => {
            const checked = event.target.checked;
            const checkboxs = document.querySelectorAll(
              ".oper-checkbox-container input.checkbox-interlock"
            );
            checkboxs.forEach((checkbox: any) => {
              if (checkbox.dataset.eqpyn == "Y") checkbox.checked = checked;
            });

            param.api.forEachNode((node) => {
              if (node.data["eqpYn"] == "Y")
                node.setDataValue("interlockYn", checked ? "Y" : "N");
            });
          }}
        />
        {param.displayName}
      </label>
    </div>
  );
};

export const checkboxCell = (param: ICellRendererParams) => {
  return (
    <>
      <label className="d-inline">
        <input
          type="checkbox"
          className="checkbox-interlock"
          data-seqno={param.data["operationSeqNo"]}
          data-eqpyn={param.data["eqpYn"]}
          defaultChecked={param.data["interlockYn"] == "Y"}
          onChange={(event: any) => {
            param.setValue!(event.target.checked ? "Y" : "N");
          }}
        />
      </label>
    </>
  );
};

export const checkboxCellBySeqNo = (param: ICellRendererParams) => {
  const index = param.rowIndex;

  if (index > 0) {
    const prev = param.api.getDisplayedRowAtIndex(index - 1);
    if (prev && prev.data["operationSeqNo"] == param.data["operationSeqNo"])
      return null;
  }

  return (
    <>
      <label className="d-inline">
        <input
          type="checkbox"
          onClick={(event: any) => {
            const checked = event.target.checked;
            const checkboxs = document.querySelectorAll(
              ".oper-checkbox-container input.checkbox-interlock"
            );
            const seqNo = param.data["operationSeqNo"];
            checkboxs.forEach((checkbox: any) => {
              if (
                checkbox.dataset.seqno == seqNo &&
                checkbox.dataset.eqpyn == "Y"
              )
                if (checkbox.dataset.eqpyn == "Y") checkbox.checked = checked;
            });

            param.api.forEachNode((node) => {
              if (node.data["operationSeqNo"] == seqNo)
                if (node.data["eqpYn"] == "Y")
                  node.setDataValue("interlockYn", checked ? "Y" : "N");
            });
          }}
        />
      </label>
    </>
  );
};

export const columnModelListDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_MODEL_CODE"), //모델코드
      field: "modelCode",
      flex : 1,
    },
    {
      headerName: t("@COL_MODEL_NAME"), //모델명
      field: "modelDescription",
      flex : 2
    },
    {
      headerName: "Top/Bottom",
      flex: 0.5,
      field : "place",
      cellStyle: { textAlign: "center" },
      cellClass: "cell-combo-container",
      filter: false,
      cellRenderer: (d: any) => {
        d.node.setDataValue('place', 'A')
        return (
          <select
            name="place"
            onChange={(event: any) => {
              d.node.setDataValue("place", event.target.value);
            }}
            className="form-select"
          >
            <option value="A">{'ALL'}</option>
            <option value="Y">{'TOP'}</option> 
            <option value="N">{'BOTTOM'}</option>
          </select>
        );
      },
    },
  ];
};

export const columnOperEqpDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_INTERLOCK"), //인터락
      field: "interlockYn",
      width:80,
      cellClass: [
        "cell-checkbox-container",
        "oper-checkbox-container",
        "cell-checkbox-disable",
      ],
      filter: false,
      headerComponent: checkboxHeader,
      cellRenderer: checkboxCell,
    },
    {
      headerName: t("@COL_OPERATION_SEQ_SELECT"), //공순선택
      field: "rowspan",
      width:80,
      cellClass: ["cell-checkbox-container", "cell-checkbox-disable"],
      cellRenderer: checkboxCellBySeqNo,
    },
    {
      headerName: t("@COL_OPERATION_SEQ_NO"), //공정순서
      field: "operationSeqNo",
      width:100,
    },
    {
      headerName: t("@COL_OPERATION_CODE"), //공정코드
      field: "operationCode",
      width:150,
    },
    // {
    //   headerName: t("@COL_OPERATION_NAME"), //공정명
    //   field: "operationDescription",
    //   width:200,
    // },
    {
      headerName: t("@COL_OPERATION_NAME"), //공정명
      field: "tranLang",
      width:250,
      valueFormatter: (d: any) => getLang(d.data.tranLang)
    },
    {
      headerName: t("@COL_EQP_CODE"), //설비코드
      field: "equipmentCode",
      width:200,
    },
    {
      headerName: t("@COL_EQP_NAME"), //설비명
      field: "equipmentDescription",
      width:200,
    },
    {
      headerName: t("@COL_DESIGNATED_FACILITY_STATUS"), //지정설비여부
      field: "eqpYn",
      width:80,
      // cellRenderer: (e: any) => {
      //   if (e.data.eqpYn === "Y") {
      //     return "지정";
      //   } else if (e.data.mapYn === "N") {
      //     return "";
      //   }
      // },
    },
    {
      headerName: t("@COL_REGISTRATION_STATUS"), //등록유무
      field: "mapYn",
      width:80,
      // cellRenderer: (e: any) => {
      //   if (e.data.mapYn === "Y") {
      //     return "등록";
      //   } else if (e.data.mapYn === "N") {
      //     return "";
      //   }
      // },
    },
  ];
};

export const columnRecipeDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: "",
      field: "checkbox",
      checkboxSelection: true,
      flex: 0.3,
    },
    {
      headerName: t("@COL_GROUP_CODE"), //그룹코드
      field: "groupCode",
      flex: 0.6,
    },
    {
      headerName: t("@COL_GROUP_NAME"), //그룹명
      field: "groupName",
      flex: 0.6,
    },
    {
      headerName: t("@COL_CONDITION_DESCRIPTION"), //조건설명
      field: "remark",
      flex: 2,
    },
  ];
};

export const columnCategoryDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_RECIPE_NAME"), //레시피명
      field: "recipeName",
      width:300,
      valueFormatter: (d: any) => getLangAll(d.data.recipeName),
    },
    {
      headerName: t("@COL_REFERENCE_VALUE"), //기준값
      field: "baseVal",
      width:80,
    },
    {
      headerName: t("@COL_ATTRIBUTE_VALUE"), //특성값
      field: "val1",
      width:80,
    },
  ];
};

export const columnParamDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_PARAMETER_NAME"), //파라미터명
      field: "paramName",
      flex: 4.5,
      valueFormatter: (d: any) => getLang(d.data.paramName),
    },
    {
      headerName: t("@COL_UNIT"), //단위
      field: "unit",
      flex: 1,
    },
    {
      headerName: t("@COL_STANDARD_VALUE"), //표준값
      field: "std",
      flex: 1,
    },
    {
      headerName: "lcl",
      field: "lcl",
      flex: 1,
    },
    {
      headerName: "ucl",
      field: "ucl",
      flex: 1,
    },
    {
      headerName: "lsl",
      field: "lsl",
      flex: 1,
    },
    {
      headerName: "usl",
      field: "usl",
      flex: 1,
    },
  ];
};
