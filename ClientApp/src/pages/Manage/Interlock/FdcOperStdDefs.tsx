import { ICellRendererParams, IHeaderParams } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { dateFormat, getLang } from "../../../common/utility";
import { DecimalEditor } from "../Reference/Product/ParamRecipeEditDefs";
import { SyntheticEvent, forwardRef, memo, useEffect, useImperativeHandle, useRef } from "react";
import AutoCombo from "../../../components/Common/AutoCombo";
import { Dictionary } from "../../../common/types";
import { Badge } from "reactstrap";

export const fdcdetailGroupName = (d: any) => {
  switch (d.data.detailType) {
    case 'O': 
      return (<Badge color="success">Open</Badge>);
    case 'S':
      return (<Badge color="danger">Short</Badge>);
    default:
      return (<Badge color="secondary" className="fw-bold">All</Badge>)
  }
}

export const fdcDefectTypeName = (d: any) => {
  if(!d.data.defectName)
    return (<span className="fw-bold">All</span>)

  const defectName = getLang(d.data.defectName);
  if(d.data.defectName == "All" || !defectName)
    return (<span className="fw-bold">All</span>)

    return (<span className="text-primary fw-bold">{defectName}</span>);
}

export const modelDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_MODEL_CODE"), //모델코드
      field: "modelCode",
      width: 180,
      tooltipValueGetter: (d:any) => d.data.modelCode,
    },
    {
      headerName: t("@COL_MODEL_NAME"), //모델명
      field: "modelName",
      width: 240,
      tooltipValueGetter: (d:any) => d.data.modelName,
    },
    {
      //headerName: "설정", //승인여부
        headerName: t("@COL_SETTING"),
      field: "settedYn",
      filter: false,
      width: 40,
      // cellRenderer: (e: any) => {
      //   if (e.data.approveYn === "N") {
      //     return "승인요청";
      //   } else if (e.data.approveYn === "Y") {
      //     return "승인완료";
      //   } else if (e.data.approveYn === "R") {
      //     return "반려";
      //   } else if (e.data.approveYn === "D") {
      //     return "재승인요청";
      //   }
      // },
    },
    {
      //headerName: "생성자",
        headerName: t("@COL_CREATE_USER"),
      field: "createUserName",
      width: 80,
    },
    {
      //headerName: "생성시간",
        headerName: t("@COL_CREATION_TIME"),
      field: "createDt",
      filter: "agDateColumnFilter",
      width: 130,
      valueFormatter: (d: any) => dateFormat(d.data.createDt),
    }

  ];
};

export const operDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_OPERATION_SEQ_NO"), //공정순서
      field: "operSeqNo",
      flex: 0.5,
      filter: false
    },
    {
      headerName: t("@COL_OPERATION_CODE"), //공정코드
      field: "operCode",
      flex: 0.6,
      filter: false
    },
    {
      headerName: t("@COL_OPERATION_NAME"), //공정명
      field: "operName",
      flex: 1.5,
      filter: false
    },
    {
      headerName: t("@DEFECT_TYPE"), //불량유형
      field: "defectType",
      flex: 0.5,
      filter: false,
      editable: false,      
    },
    {
      headerName: "불량유형명",
      field: "defectName",
      flex: 0.8,
      filter: false,
      editable: false,
      cellRenderer: fdcDefectTypeName
    },
    {
      headerName: 'layer',
      field: "layer",
      flex: 0.5,
      filter: false,
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
    {
        //headerName: "기준불량률",
        headerName: t("@COL_STANDARD_DEFECTRATE"), //공정명
      field: "defectRate",
      flex: 0.6,
      filter: false,
      cellDataType: 'number',
      editable: true,
      cellEditor: DecimalEditor,
    },
    {
      headerName: t("@REMARK"), //PV명
      field: "remark",
      flex: 1.7,
      filter: false,
      editable: true,
      cellEditor: 'agTextCellEditor',
    },
  ];
};

export const gapDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: `Gap ${t("@COL_TARGET_PROCESS")}`,  //"Gap 대상 공정",
      headerClass: "no-leftborder",
      children: [
        {
          headerName: t("@COL_OPERATION_SEQ_NO"), //공정순서
          field: "operSeqNo",
          width: 95,
          filter: false,
          cellRenderer: (d: any) => {
            return (
              <>
                { d.data.operSeqNo }
                {
                  d.data.plusOperSeqNo ? ` + ${d.data.plusOperSeqNo}` : ""
                }
              </>
            );
          }
        },
        {
          headerName: t("@COL_OPERATION_CODE"), //공정코드
          field: "operCode",
          width: 130,
          filter: false,
          cellRenderer: (d: any) => {
            return (
              <>
                { d.data.operCode }
                {
                  d.data.plusOperCode ? ` + ${d.data.plusOperCode}` : ""
                }
              </>
            );
          }
        },
        {
          headerName: t("@COL_OPERATION_NAME"), //공정명
          field: "operName",
          width: 200,
          filter: false,
          cellRenderer: (d: any) => {
            return (
              <>
                { d.data.operName }
                {
                  d.data.plusOperName ? ` + ${d.data.plusOperName}` : ""
                }
              </>
            );
          }
        },        
      ]
    },
    {
      //headerName: "Gap 비교 공정",
        headerName: `Gap ${t("@COL_COMPARATIVE_PROCESS")}`,
      headerClass: "no-leftborder",
      children: [
        {
          //headerName: "공순", //공정순서
          headerName: t("@OPER_SEQ"),
          field: "toOperSeqNo",
          width: 45,
          filter: false,
        },
        {
          //headerName: "공정코드", //공정코드
          headerName: t("@COL_OPERATION_CODE"),
          field: "toOperCode",
          width: 65,
          filter: false,
        },
        {
          //headerName: "공정명", //공정명
          headerName: t("@COL_OPERATION_NAME"),
          field: "toOperName",
          width: 120,
          filter: false,
        },    
      ]
    },
    {
      //headerName: "기준값",
        headerName: t("@COL_REFERENCE_VALUE"),
      
      headerClass: "no-leftborder",
      children: [
        {
          headerName: t("@DEFECT_TYPE"), //불량유형
          field: "detailType",
          width: 65,
          filter: false,
          editable: false,
          cellRenderer: fdcdetailGroupName
        },        
        {
          headerName: `GAP ${t("@COL_DEFECT_RATE")}`,
          field: "defectRate",
          width: 80,
          filter: false,
          cellDataType: 'number',
          editable: true,
          cellEditor: DecimalEditor,
        },
        {
          headerName: t("@REMARK"), //PV명
          field: "remark",
          width: 270,
          filter: false,
          editable: true,
          cellEditor: 'agTextCellEditor',
        },
      ]
    },
  ];
};
