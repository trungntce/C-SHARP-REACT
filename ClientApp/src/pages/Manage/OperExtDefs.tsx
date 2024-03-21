import moment from 'moment';
import { useTranslation } from "react-i18next";
import { Button } from 'reactstrap';
import { Dictionary } from '../../common/types';
import { dateFormat, getLang, getLangAll } from '../../common/utility';

export const pageContext: Dictionary = {
  saveHandler: (data: Dictionary) => {},
  deleteHandler: (data: Dictionary) => {}
};

export const checkCol = (headerName: string, field: string, flex?: number, cellStyle?: {}) => {
  return { 
    headerName: headerName, 
    field: field, 
    flex: flex || 1.2, 
    cellStyle: cellStyle || {textAlign: 'center'}, 
    cellClass: ["cell-checkbox-container", "cell-checkbox-disable"],
    filter: false,
    cellRenderer: (d: any) => {
      return (
        <label>
          <input type='checkbox' defaultChecked={d.data[field] == 'Y'} onClick={(event: any) => { 
            d.setValue(event.target.checked ? 'Y' : 'N');
          }} />
        </label>
      );
    }
  }
}

export const columnDefs = () => {
  const { t }  = useTranslation();
  
  return [
    {
      headerName: t("@CHANGE"), //"변경",
      headerClass: "no-leftborder",
      children: [
        {
          headerName: `${t("@EDIT")}/${t("@DELETE")}`, //"수정/삭제",
          headerClass: "no-leftborder",
          minWidth: 85,
          maxWidth: 85,
          filter: false,
          cellClass: "cell-button-container",
          cellStyle: {textAlign: 'center'}, 
          cellRenderer: (d: any) => {
            return (
              <>
                <Button type="button" color="primary" className="btn-sm" onClick={() => {
                  pageContext.saveHandler(d.data);
                }}>
                  <i className="uil uil-check"></i>
                </Button>
                <Button type="button" color="light" className="btn-sm" onClick={() => {
                  pageContext.deleteHandler(d.data);
                }}>
                  <i className="uil uil-times"></i>
                </Button>
              </>
            );
          }
        },
      ]
    },
    {
      headerName: t("@COL_OPERATION_INFO"), //"공정정보",
      children: [
        {
          headerName: t("@COL_OPERATION_CODE"),//"공정코드",
          field: "operationCode",
          flex: 1.5,
        },
        // {
        //   headerName: t("@COL_OPERATION_NAME"), //"공정명",
        //   field: "operationDesc",
        //   flex: 3,
        // },
        {
          headerName: t("@COL_OPERATION_NAME"), //"공정명",
          field: "tranOperName",
          flex: 5,
          valueFormatter: (d: any) => getLang(d.data.tranOperName)
        },
        {
          headerName: t("@COL_USE"), //"사용",
          field: "enableFlag",
          flex: 1.2,
          cellStyle: {textAlign: 'center'}, 
          filter: false,
        },
        {
          headerName: t("@COL_OPERATION_DIVISION"), //"공정구분",
          field: "operYn",
          flex: 1.7,
          cellStyle: {textAlign: 'center'}, 
          cellClass: "cell-combo-container",
          filter: false,
          cellRenderer: (d: any) => {
            return (
              <select name="operYn" defaultValue={d.data["operYn"]} onChange={
                (event: any) => { 
                  d.node.setDataValue("operYn", event.target.value);
                }
              } className="form-select">
                  {/* 미사용
                  필수공정
                  선택공정 */}
                  <option value="N">{t("@UNUSED")}</option>
                  <option value="Y">{t("@REQUIRED_OPERATION")}</option>
                  <option value="O">{t("@SELECTION_OPERATION")}</option>
                </select>
            );
          }
        },
      ]
    },
    // {
    //   headerName: "4M스캔",
    //   children: [
    //     //checkCol("작업자", "scanWorkerYn"),
    //     //checkCol("자재", "scanMaterialYn"),
    //     //checkCol("툴", "scanToolYn"),
    //   ]
    // },
    // {
    //   headerName: "시작종료여부",
    //   children: [
    //     checkCol("시작", "startYn"),
    //     checkCol("종료", "endYn"),
    //   ]
    // },
    {
      headerName: t("@COL_OPERATION_SETTING"), //"공정설정",      
      children: [
        checkCol(t("@COL_EQUIPMENT"), "scanEqpYn"),       //설비
        checkCol(t("@COL_TOOL"), "scanToolYn"),           //툴
        checkCol(t("@COL_SPEED_SCAN"), "scanPanelYn"),    //고속스캔
        {
          headerName: t("@COL_BARCODE_DIVISION"), //"바코드구분",
          field: "scanType",
          flex: 1.6,
          cellClass: "cell-combo-container cell-combo-disable",
          cellRenderer: (d: any) => {
            return (
              <select name="scanType" placeholder={t("@COL_BARCODE_DIVISION")} 
                className="form-select"
                defaultValue={d.data["scanType"] || 'P'} 
                onChange={(event: any) => { 
                  d.node.setDataValue("scanType", event.target.value);
                }}
              >
                <option value="R">ROLL</option>
                <option value="P">PANEL</option>
                <option value="C">PCS</option>
                <option value="S">SHEET</option>
              </select>
            );
          }
        },
        {
          headerName: t("@COL_REWORK_DIVISION"), //"재처리구분",
          field: "reworkYn",
          flex: 1.6,
          cellClass: "cell-combo-container cell-combo-disable",
          cellRenderer: (d: any) => {
            return (
              <select name="reworkYn" defaultValue={d.data["reworkYn"]} onChange={
                (event: any) => { 
                  d.node.setDataValue("reworkYn", event.target.value);
                }
              } className="form-select">
                  {/* 재처리허용
                  승인필요
                  재처리불가 */}
                  <option value="N">{t("@REWORK_ALLOW")}</option>
                  <option value="Y">{t("@APPROVAL_REQUIRED")}</option>
                  <option value="O">{t("@REWORK_IMPOSSIBLE")}</option>
                </select>
            );
          }
        },
        //checkCol("분할", "splitYn"),
        checkCol("LAYUP", "mergeYn"),
      ]
    },
    {
      headerName: t("@ETC"), //"기타",
      children: [
        {
          headerName: t("@REMARK"), //"설명",
          field: "remark",
          flex: 4,
          cellClass: "cell-input-disable",
          editable: true,
          cellEditor: 'agTextCellEditor',
          cellEditorParams: {
            maxLength: 500
          }
        },
        {
          headerName: t("@COL_CREATE_USER"), // "생성자",
          field: "createUser",
          flex: 1.5,
        },
        {
          headerName: t("@COL_CREATION_TIME"), //"생성시간",
          field: "createDt",
          filter: "agDateColumnFilter",
          flex: 1.7,
          valueFormatter: (d: any) => dateFormat(d.data.createDt)
        }        
      ]
    }
  ];
}