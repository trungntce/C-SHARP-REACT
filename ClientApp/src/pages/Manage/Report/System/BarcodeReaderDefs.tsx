import { ColDef } from "ag-grid-community";
import { dateFormat } from "../../../../common/utility";
import { TimeFormat } from "../../../AnyPage/utills/getTimes";
import StatusRender from "./StatusRender";
import BarcodeAutoComboRender from "./BarcodeAutoComboRender";
import {
  SyntheticEvent,
  forwardRef,
  memo,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";

const AutoComboCellForRaw = memo(
  forwardRef((props: any, ref: any) => {
    const createInitialState = () => {
      return {
        value: props.value,
        highlightAllOnFocus: false,
      };
    };

    const comboRef = useRef<any>(null);
    const initialState = createInitialState();

    useEffect(() => {
      comboRef.current.setValue({ value: initialState.value, label: "" });
      comboRef.current.setOpen(true);
    }, []);

    let mapCode = "code";
    let category = "SOLVE_DETAIL";

    useImperativeHandle(ref, () => {
      return {
        getValue() {
          const value = comboRef.current.getValue();
          return value?.label;
        },
      };
    });

    const changeHandler = (
      event: SyntheticEvent<Element, Event>,
      value: Dictionary | null
    ) => {
      switch (props.colDef.field) {
        case "rawType": {
          props.node.setDataValue("tableName", "");
          props.node.setDataValue("columnName", "");
          break;
        }
        case "tableName": {
          props.node.setDataValue("columnName", "");
          break;
        }
      }

      window.setTimeout(() => {
        props.stopEditing(false);
      }, 0);
    };

    return (
      <AutoCombo
        name="innerCombo"
        sx={{ width: "100%" }}
        mapCode={mapCode}
        category={category}
        ref={comboRef}
        onChange={changeHandler}
        disablePortal={false}
      />
    );
  })
);

export const readerDefs: ColDef[] = [
  {
    headerName: "Device ID",
    field: "eqpCode",
    flex: 1,
    maxWidth: 150,
  },
  {
    headerName: "Device명",
    field: "eqpName",
    flex: 1,
    maxWidth: 350,
  },
  {
    headerName: "작업장명",
    field: "workcenterDescription",
    flex: 1,
    maxWidth: 200,
  },
  {
    headerName: "마지막 응답시간",
    field: "lastDt",
    flex: 1,
    maxWidth: 220,
    valueFormatter: (d: any) => TimeFormat(d.data.lastDt),
  },
  {
    headerName: "상태(통신중단시간 / 분)",
    field: "status",
    flex: 1,
    maxWidth: 200,
    cellRenderer: StatusRender,
  },
  {
    headerName: "조치사항",
    field: "remark",
    flex: 1,
    maxWidth: 200,
    editable: true,
    cellEditor: AutoComboCellForRaw,
  },
];
