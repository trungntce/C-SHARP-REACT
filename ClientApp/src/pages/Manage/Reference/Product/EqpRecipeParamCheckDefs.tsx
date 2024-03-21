import { ICellRendererParams } from "ag-grid-community";
import { forwardRef, memo, SyntheticEvent, useEffect, useImperativeHandle, useRef } from "react";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";

const AutoComboCellForRaw = memo(
  forwardRef((props: any, ref: any) => {
    const createInitialState = () => {
      return {
        value: props.value,
        highlightAllOnFocus : false,
      };
    };

    const comboRef = useRef<any>(null);
    const initialState = createInitialState();

    useEffect(() => {
      comboRef.current.setValue({ value: initialState.value, label: "" });
      comboRef.current.setOpen(true);
    }, []);

    let mapCode = "code";
    let category = "PVSV";

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          const value = comboRef.current.getValue();
          return value?.value;
        },
      };
    });

    const changeHandler = (event: SyntheticEvent<Element, Event>, value: Dictionary | null) => {
      switch(props.colDef.field){
        case "rawType":
        {
          props.node.setDataValue("tableName", "");
          props.node.setDataValue("columnName", "");
          break;
        }
        case "tableName":
        {
          props.node.setDataValue("columnName", "");
          break;
        }
      }
      
      window.setTimeout(() => {
        props.stopEditing(false);
      }, 0);
    }

    return (
      <AutoCombo name="innerCombo" sx={{ width: "100%" }} mapCode={mapCode} category={category}
        ref={comboRef}
        onChange={changeHandler}
        disablePortal={false}
      />
    );
  })
);


const pickRenderer = (param: ICellRendererParams) => {
  if(param.data.columnname.indexOf('datajson.') >= 0)
    return null;

  return (
    <>
      <label className="d-inline">
        <input disabled={param.data.symbolused === "N" ? true : false} type='checkbox' defaultChecked={param.data.pick == 'Y'} onClick={(event: any) => { 
          const checked = event.target.checked;
          param.node.setDataValue("pick", checked ? "Y" : "N");
        }} />
      </label>
      {' '}
    </>
  );
}


export const columnDefs = () =>{
  const { t }  = useTranslation();

  return [
    {
      headerName: t("@COL_DETAILED_DIVISION"), //상세구분
      field: "factoryname",
      flex: 1,
    },
    {
      headerName: t("@COL_EQP_CODE"), //설비코드
      field: "eqpCode",
      flex: 1,
    },
    {
      headerName: t("@COL_EQP_NAME"), //설비명
      field: "eqpName",
      flex: 2,
    },
    {
      headerName: t("@COL_COLLECTION_TYPE"), //수집유형
      field: "rawType",
      flex: 0.7,
      valueFormatter: (d: any) => d.data.rawType == 'P' ? "PC" : "PLC",
    },
    {
      headerName: "TableName",
      field: "tablename",
      flex: 1,
    },
    {
      headerName: "ColumnName",
      field: "columnname",
      flex: 1,
    },
    {
      headerName: "RP-Description",
      field: "firstName",
      flex: 1.7,
    },
    {
      headerName: `${t("@COL_COLUMN")} ${t("@COL_USE_STATUS")}`, //컬럼 사용유무
      field: "symbolused",
      flex: 0.8,
    },
    {
      headerName: t("@COL_USE"), //사용
      field: "pick",
      flex: 0.6,
      suppressMenu: true,
      cellRenderer: pickRenderer,
    },
    {
      headerName: "SV/PV",
      field: "pvsv",
      flex: 0.8,
      editable: true,
      cellEditor: AutoComboCellForRaw,
      valueFormatter: (d: any) => d.data.pvsv == "P" ? "PV" : d.data.pvsv == "S" ? "SV" : "",
    },
    {
      headerName: `${t("@COL_TECHNICAL_NAME")} PARAMETER${t("@COL_NAME")}`, //기술명 PARAMETER명
      field: "lastName",
      flex: 1.9,
      editable: true,
    },
  
  ]
}