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
import { useTranslation } from "react-i18next";

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



export const EpStatusDefs = () => {
  const { t } = useTranslation();
  return [
    {
      headerName: "Device ID",
      field: "hcCode",
      flex: 1,
      maxWidth: 150,
    },
    {
      headerName: `Device ${t("@COL_NAME")}`,//"Device명",
      field: "hcName",
      resizable: true,
      minWidth: 400,
    },
    {
      headerName: t("@COL_WORKCENTER_NAME"),//"작업장명",
      field: "workcenterDescription",
      resizable: true,
      valueFormatter: (d: any) => d.data.workcenterDescription.split(",")[0],
    },
    {
        headerName: `${t("@LAST")} ${t("@RESPONSE_TIME")}`,//"마지막 응답시간",
      field: "lastDt",
      flex: 1,
      maxWidth: 220,
      valueFormatter: (d: any) =>
        d.data.lastDt ? TimeFormat(d.data.lastDt) : "-",
    },
    {
      headerName: `${t("@STATE")}(${t("@COMMUNICATION_INTERRUPTION")} / ${t("@MINUTE")})`,//"상태(통신중단 / 분)",
      field: "status",
      flex: 1,
      maxWidth: 200,
      cellRenderer: StatusRender,
    },
    {
      headerName: `${t("@COL_DETAILS")}${t("@INFORMATION")}`,//"상세정보",
      field: "remark",
      flex: 1,
      editable: true,
      //cellEditor: AutoComboCellForRaw,
    },
  ];
}






export const DownListDefs = () =>{
  const { t } = useTranslation();
  return [
    {
      headerName: t("@COL_OCCURRENCE_TIME"),//"발생시간",
      field: "insertDt",
      flex: 1,
      maxWidth: 200,
      valueFormatter: (d: any) => TimeFormat(d.data.insertDt),
    },
    {
      headerName: `Device ${t("@COL_NAME")}`,//"Device 명",
      field: "eqpCode",
      flex: 1,
      maxWidth: 350,
    },
    {
      headerName: t("@ACTION"),//"조치",
      field: "insertRemark",
      flex: 1,
    },
  ];
}
