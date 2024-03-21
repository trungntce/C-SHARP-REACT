import {
  ICellRendererParams,
  IHeaderParams,
  RowSpanParams,
} from "ag-grid-community";
import {  dateFormat } from "../../../../common/utility";
import { Button } from "reactstrap";
import { useTranslation } from "react-i18next";
import { getLang, getLangAll } from "../../../../common/utility";

export const checkboxCellByRecipeChange = (param: ICellRendererParams) => {
  return (
    <>
        <input
          type="checkbox"
          className="checkbox-recipe-change-yn"
          defaultChecked={param.data["recipeChangeYn"] == "Y"}
        />
    </>
  )
};

export const columnModelListDefs = () => {
  const { t } = useTranslation();
  return [
    {
      field: "approveDt",
      headerName: "승인일",
      width: 150, 
      headerClass: "no-leftborder cell-header-group-2",
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.approveDt)
          return '';
  
        if(d.data.approveDt.toUpperCase().indexOf("TOTAL") >= 0 || 
          d.data.approveDt.toUpperCase().indexOf("SUM") >= 0 || 
          d.data.approveDt.toUpperCase().indexOf("AMOUNT") >= 0)
          return ( <div className="text-center">{d.data.approveDt}</div> );  
  
        return dateFormat(d.data.approveDt, "YYYY-MM-DD HH:MM:SS")
      }
    },
    {
      field: "createDt",
      headerName: "요청일",
      width: 150, 
      headerClass: "no-leftborder cell-header-group-2",
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.createDt)
          return '';
  
        if(d.data.createDt.toUpperCase().indexOf("TOTAL") >= 0 || 
          d.data.createDt.toUpperCase().indexOf("SUM") >= 0 || 
          d.data.createDt.toUpperCase().indexOf("AMOUNT") >= 0)
          return ( <div className="text-center">{d.data.createDt}</div> );  
  
        return dateFormat(d.data.createDt, "YYYY-MM-DD HH:MM:SS")
      }
    },
    {
      headerName: "REV",
      field: "revCode",
      width:200,
    },
    // {
    //   headerName: "REV 설명",
    //   field: "revNote",
    //   width:100,
    // },
    {
      headerName: t("@COL_MODEL_CODE"),
      field: "modelCode",
      width:200,
    },
    {
      headerName: t("@COL_MODEL_NAME"),
      field: "modelName",
      width:200,
    },
    {
      headerName: "구분",
      field: "type",
      width:100,
    },
    {
      headerName: "등록사유",
      field: "revNote",
      width:200,
    },
    {
      headerName: t("@APPROVAL_STATUS"),
      field: "approveYn",
      width:200,
      valueFormatter: (d: any) => getLang(d.data.approveYn),
    },
    {
      headerName: "첨부파일",
      field: "file",
      width:200,
      cellRenderer: (d: any) => {
        if(!d.data || !d.data.filelocation)
          return ''
          
        return (
          <>
            <a className="btn-primary" onClick={()=> {}}>
              <i className="uil uil-file me-2"></i>첨부파일
            </a>
          </>
        )
      }
    },
    {
      headerName: "요청자",
      field: "createUser",
      width:150,
    },
    {
      headerName: "합의(생산)",
      field: "val1",
      width:300,
    },
    {
      headerName: "합의(품질)",
      field: "val2",
      width:300,
    },
    {
      headerName: "합의(계획)",
      field: "val3",
      width:300,
    },
    {
      headerName: "합의(제품)",
      field: "val4",
      width:300,
    },
    {
      headerName: "승인자",
      field: "note",
      width:300,
    },
    // {
    //   headerName: "승인자",
    //   field: "approveUser",
    //   width:100,
    // },
    {
      headerName: "Note",
      field: "reasonNote",
      width:200,
    },
  ];
};

export const columnModelDetailDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: "변경항목",
      field: "recipeChangeYn",
      cellClass: ["recipe-checkbox-container"],
      cellRenderer: checkboxCellByRecipeChange,
      width:80,
    },
    {
      headerName: "REV",
      field: "revCode",
      width:100,
    },
    {
      headerName: t("@COL_MODEL_CODE"),
      field: "modelCode",
      width:200,
    },
    {
      headerName: t("@COL_OPERATION_SEQ_NO"),
      field: "pNumber",
      width:100,
    },
    {
      headerName: t("@COL_OPERATION_CODE"),
      field: "pCode",
      width:100,
    },
    {
      headerName: t("@COL_EQP_CODE"),
      field: "eCode",
      width:130,
    },
    {
      headerName: t("@COL_RECIPE_CODE"),
      field: "recipeCode",
      width:150,
    },
    {
      headerName: t("@COL_RECIPE_NAME"),
      field: "recipeName",
      width:100,
    },
    // {
    //   headerName: "RECIPE FILE",
    //   field: "recipeFile",
    //   width:100,
    // },
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