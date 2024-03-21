import { ICellRendererParams, IHeaderParams } from "ag-grid-community";
import { forwardRef, memo, SyntheticEvent, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { Dictionary } from "../../../../common/types";
import {  dateFormat, executeIdle, getLang, getLangAll } from "../../../../common/utility";
import AutoCombo from "../../../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";
import LangTextBox from "../../../../components/Common/LangTextBox";
import { Button } from "reactstrap";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";

const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';
const KEY_HOME = 'Home';
const KEY_END = 'End';
const KEY_F2 = 'F2';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

const isCharDecimal = (charStr: any) => {
  return !!/[\d\.]/.test(charStr);
};

const isDecimalKey = (event: any) => {
  const charStr = event.key;
  return isCharDecimal(charStr);
};

const isCharNumeric = (charStr: any) => {
  return !!/[\d]/.test(charStr);
};

const isNumericKey = (event: any) => {
  const charStr = event.key;
  return isCharNumeric(charStr);
};

const isBackspace = (event: any) => {
  return event.key === KEY_BACKSPACE;
};

const isDelete = (event: any) => {
  return event.key === KEY_DELETE;
};

const isHome = (event: any) => {
  return event.key === KEY_HOME;
};

const isEnd = (event: any) => {
  return event.key === KEY_END;
};

export const NumericEditor = memo(
  forwardRef((props: any, ref: any) => {
    const createInitialState = () => {
      let startValue;
      let highlightAllOnFocus = false;
      const eventKey = props.eventKey;

      if (eventKey === KEY_BACKSPACE) {
        startValue = '';
      } else if (isCharDecimal(eventKey)) {
        if(props.value)
          startValue = props.value + eventKey;
        else
          startValue = eventKey;
        highlightAllOnFocus = false;
      } else {
        startValue = props.value;
        if (props.eventKey === KEY_F2) {
          highlightAllOnFocus = false;
        }
      }

      return {
        value: startValue,
        highlightAllOnFocus,
      };
    };

    const initialState = createInitialState();
    const [value, setValue] = useState(initialState.value);
    const [highlightAllOnFocus, setHighlightAllOnFocus] = useState(
      initialState.highlightAllOnFocus
    );
    const refInput = useRef<any>(null);

    useEffect(() => {
      const eInput = refInput.current;
      eInput.focus();
      if (highlightAllOnFocus) {
        eInput.select();

        setHighlightAllOnFocus(false);
      } else {
      }
    }, []);

    const cancelBeforeStart =
      props.eventKey &&
      props.eventKey.length === 1 &&
      '1234567890'.indexOf(props.eventKey) < 0;

    const isLeftOrRight = (event: any) => {
      return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1;
    };

    const finishedEditingPressed = (event: any) => {
      const key = event.key;
      return key === KEY_ENTER || key === KEY_TAB;
    };

    const onKeyDown = (event: any) => {
      if (isLeftOrRight(event) || isBackspace(event) || isDelete(event) || isHome(event) || isEnd(event)) {
        event.stopPropagation();
        return;
      }

      if (!finishedEditingPressed(event) && !isNumericKey(event)) {
        if (event.preventDefault) event.preventDefault();
      }

      if (finishedEditingPressed(event)) {
        props.stopEditing(false);
      }
    };

    const onKeyUp = (event: any) => {
      let val = event.target.value;
      if(!val)
        return;
      const divisor = Math.pow(10, 3);

      if (val != Math.floor(val * divisor)/divisor) {
        setValue(Math.floor(val * divisor)/divisor);
      }
    };

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return value === '' || value == null ? null : parseInt(value);
        },
        isCancelBeforeStart() {
          return cancelBeforeStart;
        },
        isCancelAfterEnd() {
          const finalValue = this.getValue();
          return false;
        },
      };
    });

    return (
      <input
        ref={refInput}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => onKeyDown(event)}
        onKeyUp={(event) => onKeyUp(event)}
        className="numeric-input"
        type="number"
      />
    );
  })
);

export const DecimalEditor = memo(
  forwardRef((props: any, ref: any) => {
    const createInitialState = () => {
      let startValue;
      let highlightAllOnFocus = false;
      const eventKey = props.eventKey;

      if (eventKey === KEY_BACKSPACE) {
        // if backspace or delete pressed, we clear the cell
        startValue = '';
      } else if (isCharDecimal(eventKey)) {
        if(props.value)
          startValue = props.value + eventKey;
        else
          startValue = eventKey;
        highlightAllOnFocus = false;
      } else {
        // otherwise we start with the current value
        startValue = props.value;
        if (props.eventKey === KEY_F2) {
          highlightAllOnFocus = false;
        }
      }

      if(startValue == null || startValue == undefined)
        startValue = '';

      return {
        value: startValue,
        highlightAllOnFocus,
      };
    };

    const initialState = createInitialState();
    const [value, setValue] = useState(initialState.value);
    const [highlightAllOnFocus, setHighlightAllOnFocus] = useState(
      initialState.highlightAllOnFocus
    );
    const refInput = useRef<any>(null);

    // focus on the input
    useEffect(() => {
      // get ref from React component
      const eInput = refInput.current;
      eInput.focus();
      if (highlightAllOnFocus) {
        eInput.select();

        setHighlightAllOnFocus(false);
      } else {
        // when we started editing, we want the caret at the end, not the start.
        // this comes into play in two scenarios:
        //   a) when user hits F2
        //   b) when user hits a printable character
        // const length = eInput.value ? eInput.value.length : 0;
        // if (length > 0) {
        //   eInput.setSelectionRange(length, length);
        // }
      }
    }, []);

    /* Utility Methods */
    const cancelBeforeStart =
      props.eventKey &&
      props.eventKey.length === 1 &&
      '1234567890.'.indexOf(props.eventKey) < 0;

    const isLeftOrRight = (event: any) => {
      return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1;
    };

    const finishedEditingPressed = (event: any) => {
      const key = event.key;
      return key === KEY_ENTER || key === KEY_TAB;
    };

    const onKeyDown = (event: any) => {
      if (isLeftOrRight(event) || isBackspace(event) || isDelete(event) || isHome(event) || isEnd(event)) {
        event.stopPropagation();
        return;
      }

      if (!finishedEditingPressed(event) && !isDecimalKey(event)) {
        if (event.preventDefault) event.preventDefault();
      }

      if (finishedEditingPressed(event)) {
        props.stopEditing(false);
      }
    };

    const onKeyUp = (event: any) => {
      let val = event.target.value;
      if(!val)
        return;
      const divisor = Math.pow(10, 3);

      if (val != Math.floor(val * divisor)/divisor) {
        setValue(Math.floor(val * divisor)/divisor);
      }
    };

    /* Component Editor Lifecycle methods */
    useImperativeHandle(ref, () => {
      return {
        // the final value to send to the grid, on completion of editing
        getValue() {
          return value === '' || value == null ? null : parseFloat(value);
        },

        // Gets called once before editing starts, to give editor a chance to
        // cancel the editing before it even starts.
        isCancelBeforeStart() {
          return cancelBeforeStart;
        },

        // Gets called once when editing is finished (eg if Enter is pressed).
        // If you return true, then the result of the edit will be ignored.
        isCancelAfterEnd() {
          const finalValue = this.getValue();
          return false;
        },
      };
    });

    return (
      <input
        ref={refInput}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => onKeyDown(event)}
        onKeyUp={(event) => onKeyUp(event)}
        className="numeric-input"
        type="number"
      />
    );
  })
);

export const LangTextCell = memo(
  forwardRef((props: any, ref: any) => {
    const createInitialState = () => {
      return {
        value: props.value,
        highlightAllOnFocus : false,
      };
    };

    const langRef = useRef<any>(null);
    const initialState = createInitialState();

    useEffect(() => {
      langRef.current.setValue(initialState.value);
      langRef.current.setFocus(0);
    }, []);

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          return langRef.current.getValue();
        },
      };
    });

    return (
      <div style={{ width: 550 }}>
        <LangTextBox ref={langRef} name="innerLangText" mode="sm" inline={true} />
      </div>
    );
  })
);

export const AutoComboCell = memo(
  forwardRef((props: any, ref: any) => {
    const createInitialState = () => {
      return {
        value: props.value,
        highlightAllOnFocus : false,
      };
    };

    const comboRef = useRef<any>(null);
    const initialState = createInitialState();

    const header = props.colDef.headerClassName;

    useEffect(() => {
      comboRef.current.setValue({ value: initialState.value, label: "" });
    }, []);

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          const value = comboRef.current.getValue();
          return value?.value;
        },
      };
    });

    return (
      <AutoCombo name="innerCombo" sx={{ width: "100%" }} mapCode={header[0]} category={header[1]}
        ref={comboRef}
      />
    );
  })
);

export const AutoComboCellForRaw = memo(
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

    let mapCode;
    let category;

    switch(props.colDef.field){
      case "rawType":
      {
        mapCode = "code";
        category = "HC_TYPE";

        break;
      }
      case "tableName":
      {
        if(props.data.rawType == 'P'){
          mapCode = "infotablepc";
        }else{
          mapCode = "infotable";
        }
        break;
      }
      case "columnName":
      {
        if(props.data.rawType == 'P'){
          mapCode = "infocolbytablepc";
        }else{
          mapCode = "infocolbytablenojson";
        }

        category = props.data.tableName;
        break;
      }
    }

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

const interlockAlarmRenderer = (param: ICellRendererParams) => {
  return (
    <>
      <label className="d-inline">
        <input type='checkbox' defaultChecked={param.data.interlockYn == 'Y'} onClick={(event: any) => { 
          const checked = event.target.checked;
          param.node.setDataValue("interlockYn", checked ? "Y" : "N");
        }} />
      </label>
      {' '}
      /
      {' '}
      <label className="d-inline">
        <input type='checkbox' defaultChecked={param.data.alarmYn == 'Y'} onClick={(event: any) => { 
          const checked = event.target.checked;
          param.node.setDataValue("alarmYn", checked ? "Y" : "N");
        }} />
      </label>
      {' '}
      /
      {' '}
      <label className="d-inline">
        <input type='checkbox' defaultChecked={param.data.judgeYn == 'Y'} onClick={(event: any) => { 
          const checked = event.target.checked;
          param.node.setDataValue("judgeYn", checked ? "Y" : "N");
        }} />
      </label>
    </>
  );
}

export const ParamEditColumnDefs = () =>{
  const { t }  = useTranslation();
  return [
    { 
      checkboxSelection: true,
      filter: false,
      width: 41,
      pinned: true,
      sortable: false,
      headerComponent: (params: IHeaderParams) => {
        return (
          <>
            <Button type="button" color="light" size="sm" onClick={() => {
              const rows = params.api.getSelectedRows();
              if(!rows.length){
                alertBox(t("@MSG_ALRAM_TYPE7")); //"삭제할 행을 선택해 주세요."
                return;
              }
          
              confirmBox(t("@DELETE_CONFIRM"), async () => { //삭제하시겠습니까?
                const selectedData = params.api.getSelectedRows();
                const res = params.api.applyTransaction({ remove: selectedData });

                alertBox(t("@DELETE_COMPLETE")); //삭제되었습니다.
              }, async () => {
              });
            }}>
              <i className="uil uil-times"></i></Button>
          </>
        );
      }
    },
    {
      headerName: t("@COL_COLLECTION_TYPE"), //수집유형
      field: "rawType",
      width: 70,
      editable: true,
      cellEditor: AutoComboCellForRaw,
      valueFormatter: (d: any) => d.data.rawType == 'P' ? "PC" : "PLC",
      filter: false,
      pinned: true
    },
    {
      headerName: `${t("@COL_EQUIPMENT")}(${t("@COL_TABLE")})`, //설비(테이블)
      field: "tableName",
      width: 150,
      editable: true,
      cellEditor: AutoComboCellForRaw,
      suppressMenu: true,
      pinned: true
    },
    {
      headerName: `${t("@COL_CATEGORY")}(${t("@COL_COLUMN")})`, //항목(컬럼)
      field: "columnName",
      width: 80,
      editable: true,
      cellEditor: AutoComboCellForRaw,
      suppressMenu: true,
      pinned: true
    },
    // {
    //   headerName: "구분",
    //   field: "pvsv",
    //   width: 60,
    //   valueFormatter: (d: any) => d.data.pvsv == 'P' ? "PV" : "SV",
    // },
    {
      headerName: t("@COL_TECHNICAL_ITEM_NAME"), //기술항목명
      field: "symbolcomment",
      width: 150,
      suppressMenu: true,
      tooltipValueGetter: (d:any) => d.data.symbolcomment,
      valueFormatter: (d: any) => {
        if (d.data.symbolcomment && d.data.symbolcomment.indexOf("||") >= 0)
          return d.data.symbolcomment.split("||")[1];
        else 
          return d.data.symbolcomment;
      },
      pinned: true
    },  
    {
      headerName: t("@COL_STANDARD_VALUE"), //표준값
      field: "std",
      width: 50,
      cellDataType: 'number',
      editable: true,
      cellEditor: DecimalEditor,
      filter: false,
      suppressMenu: true,
    },
    {
      headerName: "lcl",
      field: "lcl",
      width: 40,
      cellDataType: 'number',
      editable: true,
      cellEditor: DecimalEditor,
      suppressMenu: true,
    },
    {
      headerName: "ucl",
      field: "ucl",
      width: 40,
      cellDataType: 'number',
      editable: true,
      cellEditor: DecimalEditor,
      suppressMenu: true,
    },
    {
      headerName: "lsl",
      field: "lsl",
      width: 40,
      cellDataType: 'number',
      editable: true,
      cellEditor: DecimalEditor,
      suppressMenu: true,
    },
    {
      headerName: "usl",
      field: "usl",
      width: 40,
      cellDataType: 'number',
      editable: true,
      cellEditor: DecimalEditor,
      suppressMenu: true,
    },
    {
      headerName: t("@COL_START"), //시작
      field: "startTime",
      width: 40,
      cellDataType: 'number',
      editable: true,
      cellEditor: NumericEditor,
      suppressMenu: true,
    },
    {
      headerName: t("@COL_END"), //종료
      field: "endTime",
      width: 40,
      cellDataType: 'number',
      editable: true,
      cellEditor: NumericEditor,
      suppressMenu: true,
    },
    {
      headerName: `${t("@COL_INTERLOCK")}/${t("@COL_ALARM")}/판정`, //인터락/알람
      field: "interlockYn",
      width: 120,
      suppressMenu: true,
      cellRenderer: interlockAlarmRenderer,
    },
    {
      headerName: t("@COL_ALARM"), //알람
      field: "alarmYn",
      width: 0,
      hide: true,
      suppressMenu: true,
    },
    {
      headerName: t("@COL_JUDGMENT"), //판정
      field: "judgeYn",
      width: 0,
      hide: true,
      suppressMenu: true,
      
    },
    {
      headerName: `PV${t("@COL_NAME")}`, //PV명
      field: "paramName",
      width: 560,
      editable: true,
      cellEditor: LangTextCell,
      valueFormatter: (d: any) => getLangAll(d.data.paramName),
    },
    {
      headerName: "PV ID",
      field: "paramId",
      width: 120,
    },
  ]
};

export const RecipeEditColumnDefs = () => {
  const { t }  = useTranslation();

  return [
    { 
      checkboxSelection: true,
      filter: false,
      width: 41,
      pinned: true,
      sortable: false,
      headerComponent: (params: IHeaderParams) => {
        return (
          <>
            <Button type="button" color="light" size="sm" onClick={() => {
              const rows = params.api.getSelectedRows();
              if(!rows.length){
                alertBox(t("@MSG_ALRAM_TYPE7")); //"삭제할 행을 선택해 주세요."
                return;
              }
          
              confirmBox(t("@DELETE_CONFIRM"), async () => { //삭제하시겠습니까?
                const selectedData = params.api.getSelectedRows();
                const res = params.api.applyTransaction({ remove: selectedData });

                alertBox(t("@DELETE_COMPLETE")); //삭제되었습니다.
              }, async () => {
              });
            }}>
              <i className="uil uil-times"></i></Button>
          </>
        );
      }
    },
    {
      headerName: t("@COL_COLLECTION_TYPE"), //수집유형
      field: "rawType",
      width: 70,
      editable: true,
      cellEditor: AutoComboCellForRaw,
      valueFormatter: (d: any) => d.data.rawType == 'P' ? "PC" : "PLC",
      filter: false,
      pinned: true      
    },
    {
      headerName: `${t("@COL_EQUIPMENT")}(${t("@COL_TABLE")})`, //설비(테이블)
      field: "tableName",
      width: 150,
      editable: true,
      cellEditor: AutoComboCellForRaw,
      suppressMenu: true,
      pinned: true      
    },
    {
      headerName: `${t("@COL_CATEGORY")}(${t("@COL_COLUMN")})`, //항목(컬럼)
      field: "columnName",
      width: 80,
      editable: true,
      cellEditor: AutoComboCellForRaw,
      suppressMenu: true,
      pinned: true      
    },
    {
      headerName: t("@COL_TECHNICAL_ITEM_NAME"), //기술항목명
      field: "symbolcomment",
      width: 150,
      tooltipValueGetter: (d:any) => d.data.symbolcomment,
      valueFormatter: (d: any) => {
        if (d.data.symbolcomment && d.data.symbolcomment.indexOf("||") >= 0)
          return d.data.symbolcomment.split("||")[1];
        else 
          return d.data.symbolcomment;
      },
      pinned: true
    },  
    {
      headerName: t("@COL_REFERENCE_VALUE"), //기준값
      field: "baseVal",
      width: 60,
      cellDataType: 'number',
      editable: true,
      cellEditor: DecimalEditor,
      filter: false,
      suppressMenu: true,
    },
    {
      headerName: t("@COL_START"), //시작
      field: "startTime",
      width: 60,
      cellDataType: 'number',
      editable: true,
      cellEditor: NumericEditor,
      suppressMenu: true,
    },
    {
      headerName: t("@COL_END"), //종료
      field: "endTime",
      width: 60,
      cellDataType: 'number',
      editable: true,
      cellEditor: NumericEditor,
      suppressMenu: true,
    },  
    {
      headerName: `${t("@COL_INTERLOCK")}/${t("@COL_ALARM")}/${t("@COL_JUDGMENT")}`, //인터락/알람
      field: "interlockYn",
      width: 120,
      suppressMenu: true,
      cellRenderer: interlockAlarmRenderer,
    },
    {
      headerName: t("@COL_ALARM"), //알람
      field: "alarmYn",
      width: 0,
      hide: true,
      suppressMenu: true,
    },
    {
      headerName: t("@COL_JUDGMENT"), //판정
      field: "judgeYn",
      width: 0,
      hide: true,
      suppressMenu: true,
    },
    {
      headerName: `SV${t("@COL_NAME")}`, //SV명
      field: "recipeName",
      width: 560,
      editable: true,
      cellEditor: LangTextCell,
      valueFormatter: (d: any) => getLangAll(d.data.recipeName),
    },
    {
      headerName: "RV ID",
      field: "recipeCode",
      width: 120,
    },
  ]
};