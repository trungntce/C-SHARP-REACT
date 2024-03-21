import { ICellRendererParams } from 'ag-grid-community';
import { dateFormat } from '../../../../common/utility';
import { useTranslation } from 'react-i18next';

export const extCategoryCellRenderer = (param: ICellRendererParams) => {
  const index = param.rowIndex;
  
  let referencePoint = "";
  for (let i=0; i<=index; i++) {
    const rowData = param.api.getDisplayedRowAtIndex(i)?.data;

    if(rowData.eqpareagroupName == "기준점"){
      referencePoint = rowData.eqpareagroupName;
    }
  }

  return (referencePoint)
}

export const extSumCellRenderer = (param: ICellRendererParams) => {
  const index = param.rowIndex;

  let sumExt = 0;
  for (let i=0; i<=index; i++) {
    const rowData = param.api.getDisplayedRowAtIndex(i)?.data;
    sumExt += rowData.extMm || 0;
  }

  return (sumExt)
}

export const eqpDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@BARCODE_EQP"),//"바코드설비",
      field: "barcodeYn",
      flex: 1,
      cellClass: ["cell-checkbox-container"],
      cellRenderer: (d: any) => {
        return (
          <label>
            <input type='checkbox' defaultChecked={d.data["barcodeYn"] == 'Y'} onClick={(event: any) => { 
              d.setValue(event.target.checked ? 'Y' : null);
            }} />
          </label>
        );
      },
    },
    {
      headerName: t("@COL_EQP_CODE"),//"설비코드",
      field: "eqpCode",
      flex: 1.1,
    },
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "equipmentDescription",
      flex: 1.7,
    },
    {
      headerName: t("@COL_WORKCENTER_CODE"),//"작업장코드",
      field: "workcenterCode",
      flex: 1,
    },
    {
      headerName: t("@COL_WORKCENTER_NAME"),//"작업장명",
      field: "workcenterDescription",
      flex: 1.7,
    },
  ]
}

export const offsetDefs = () => {
  const { t } = useTranslation()
  return [
    {
      headerName: `${t("@LARGE_CATEGORY")} ${t("@SORT")}`,//"대분류 순서",
      field: "eqpareagroupSeq",
      flex: 1,
      cellRenderer: (e:any) => {
        if(e.data.eqpareagroupSeq === 0) {
          return "-";
        }else{
          return e.data.eqpareagroupSeq;
        }
      }
    },
    {
      headerName: t("@LARGE_CATEGORY"),//"대분류",
      field: "eqpareagroupName",
      flex: 1.3,
    },
    {
      headerName: `${t("@MIDDLE_CATEGORY")} ${t("@SORT")}`,//"중분류 순서",
      field: "eqpareaSeq",
      flex: 1,
    },
    {
      headerName: t("@MIDDLE_CATEGORY"),//"중분류",
      field: "eqpareaName",
      flex: 1.7,
    },
    {
      headerName: "구간거리",
      field: "extMm",
      flex: 1.2,
    },
    {
      headerName: "기준점정의",
      field: "referencePoint",
      flex: 1.7,
      cellRenderer: extCategoryCellRenderer,
    },
    {
      headerName: t("@DISTANCE_ACCUMULATION"),//"거리누적",
      field: "sumExtMm",
      flex: 1.2,
      cellRenderer: extSumCellRenderer,    
    },
  ]
}

export const paramDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: `${t("@COL_REGISTRATION")} ${t("@PARAMETER")}`,//"등록 파라미터",
      field: "paramName",
      flex: 1.2,
    },
  ]
}

export const eqpParamDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_EQP_NAME"),//"설비명",
      field: "equipmentDescription",
      flex: 1,
    },
    {
      headerName: t("@COL_PARAMETER_NAME"),//"파라미터명",
      field: "paramName",
      flex: 1,
    },
    {
      headerName: t("@COL_CATEGORY_NAME"),//"카테고리명",
      field: "cateName",
      flex: 1,
    },
    {
      headerName: `RawTable${t("@COL_NAME")}`,//"RawTable명",
      field: "tableName",
      flex: 0.8,
    },
    {
      headerName: `RawColumn${t("@COL_NAME")}`,//"RawColumn명",
      field: "columnName",
      flex: 0.8,
    },
  ]
}

export const speedParamDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: `${t("@SPEED")} ${t("@PARAMETER")}`,//"속도 파라미터",
      field: "speedParamName",
      flex:1
    }
  ]
}