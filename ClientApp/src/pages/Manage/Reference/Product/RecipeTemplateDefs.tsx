import {
  ICellRendererParams,
  IHeaderParams,
  RowSpanParams,
} from "ag-grid-community";
import {  dateFormat } from "../../../../common/utility";
import { Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { getLangAll } from "../../../../common/utility";


export const columnParamListDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_EQP_CODE"),//"설비명",
      field: "eqpCode",
      width:200,
    },
    {
      headerName: t("@COL_GROUP_CODE"),//"그룹코드",
      field: "groupCode",
      width:150,
    },
    {
      headerName: t("@COL_GROUP_NAME"),//"그룹명",
      field: "groupName",
      width:200,
    },
    {
      headerName: t("@COL_COLLECTION_TYPE"), //수집유형
      field: "rawType",
      width:100,
      valueFormatter: (d: any) => d.data.rawType == 'P' ? "PC" : "PLC",
    },
    {
      headerName: `RawTable${t("@COL_NAME")}`, //설비(테이블)
      field: "tablename",
      width:150,
    },
    {
      headerName: `RawColumn${t("@COL_NAME")}`, //항목(컬럼)
      field: "columnname",
      width:130,
    },
    {
      headerName: `PV${t("@COL_NAME")}`, //"PV명"
      field: "firstName",
      width:200,
    },
    {
      headerName: t("@COL_TECHNICAL_ITEM"), //기술항목명
      field: "lastName",
      width:200,
    },
    {
      headerName: t("@COL_STANDARD_VALUE"),//"표준값",
      field: "std",
      width:180,
    },
    {
      headerName: "lcl",
      field: "lcl",
      width:80,
    },
    {
      headerName: "ucl",
      field: "ucl",
      width:80,
    },
    {
      headerName: "lsl",
      field: "lsl",
      width:80,
    },
    {
      headerName: "usl",
      field: "usl",
      width:80,
    },
    {
      headerName: t("@COL_START"),
      field: "startTime",
      width:150,
    },
    {
      headerName: t("@COL_END"),
      field: "endTime",
      width:150,
    },
    {
      headerName: t("@COL_INTERLOCK_ALARM"), //인터락/알람
      field: "interlock_arlam",
      width:180,
      cellRenderer: (d: any) => { 
        if (!d.data || !d.data.interlockYn || !d.data.alarmYn)
        return '';
        
        return d.data.interlockYn + "/" + d.data.alarmYn; 
      }
    },
    // {
    //   headerName: "PVID",
    //   field: "paramId",
    //   width:200,
    // },
  ];
};

export const columnRecipeListDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_EQP_CODE"),//"설비명",
      field: "eqpCode",
      width:200,
    },
    {
      headerName: t("@COL_GROUP_CODE"),//"그룹코드",
      field: "groupCode",
      width:150,
    },
    {
      headerName: t("@COL_GROUP_NAME"),//"그룹명",
      field: "groupName",
      width:200,
    },
    {
      headerName: t("@COL_COLLECTION_TYPE"), //수집유형
      field: "rawType",
      width:100,
      valueFormatter: (d: any) => d.data.rawType == 'P' ? "PC" : "PLC",
    },
    {
      headerName: `RawTable${t("@COL_NAME")}`, //설비(테이블)
      field: "tablename",
      width:150,
    },
    {
      headerName: `RawColumn${t("@COL_NAME")}`, //항목(컬럼)
      field: "columnname",
      width:130,
    },
    {
      headerName: `SV${t("@COL_NAME")}`, //"SV명"
      field: "firstName",
      width:200,
    },
    {
      headerName: t("@COL_TECHNICAL_ITEM"), //기술항목명
      field: "lastName",
      width:200,
    },
    {
      headerName: t("@COL_STANDARD_VALUE"),//"표준값",
      field: "std",
      width:180,
    },
    {
      headerName: t("@COL_START"),
      field: "startTime",
      width:150,
    },
    {
      headerName: t("@COL_END"),
      field: "endTime",
      width:150,
    },
    {
      headerName: t("@COL_INTERLOCK_ALARM"), //인터락/알람
      field: "interlock_arlam",
      width:180,
      cellRenderer: (d: any) => { 
        if (!d.data || !d.data.interlockYn || !d.data.alarmYn)
        return '';
        
        return d.data.interlockYn + "/" + d.data.alarmYn; 
      }
    },
    // {
    //   headerName: "RVID",
    //   field: "recipeCode",
    //   width:200,
    // },
  ];
};

export const checkboxCell = (param: ICellRendererParams) => {
  return (
    <>
        <input
          type="checkbox"
          className="checkbox-interlock-yn"
          defaultChecked={param.data["interlockYn"] == "Y"}
          onChange={(event: any) => {
            param.setValue!(event.target.checked ? "Y" : "N");
          }}
        />
    </>
  )
};

export const columnModelDetailDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_MODEL_CODE"),
      field: "modelCode",
      width:200,
    },
    {
      headerName: t("@COL_INTERLOCK"), //인터락
      field: "interlockYn",
      cellClass: ["interlock-checkbox-container"],
      cellRenderer: checkboxCell,
      filter: false,
      width:110,
    },
    {
      headerName: t("@COL_OPERATION_SEQ_NO"),
      field: "operSeqNo",
      width:100,
    },
    {
      headerName: t("@COL_OPERATION_CODE"),
      field: "operCode",
      width:100,
    },
    {
      headerName: t("@COL_OPERATION_NAME"),
      field: "operDesc",
      width:150,
    },
    {
      headerName: t("@COL_EQP_CODE"),
      field: "eqpCode",
      width:130,
    },
    {
      headerName: t("@COL_EQP_NAME"),
      field: "eqpDesc",
      width:230,
    },
    {
      headerName: t("@COL_RECIPE_CODE"),
      field: "recipeCode",
      width:150,
    },
    {
      headerName: t("@COL_RECIPE_NAME"),
      field: "recipeName",
      width:200,
    },
    {
      headerName: t('@COL_PTYPE'),
      field: "pType",
      width: 120,
    },
    {
        headerName: t('@COL_SV_PV_CODE'),
        field: "svPvCode",
        width: 120,
    },
    {
      headerName: t('@COL_SV_PV_NAME'),
      field: "svPvName",
      width: 120,
    },
    {
      headerName: t('@COL_SV_VALUE'),
      field: "svStd",
      width:100,
    },
    {
      headerName: t('@COL_PV_VALUE'),
      field: "pvStd",
      width:100,
    },
    {
      headerName: t('@COL_PV_LCL'),
      field: "pvLcl",
      width:100,
    },
    {
      headerName: t('@COL_PV_UCL'),
      field: "pvUcl",
      width:100,
    },
    {
      headerName: t('@COL_PV_LSL'),
      field: "pvLsl",
      width:100,
    },
    {
      headerName: t('@COL_PV_USL'),
      field: "pvUsl",
      width:100,
    },
  ];
};