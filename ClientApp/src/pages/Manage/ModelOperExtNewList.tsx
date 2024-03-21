import { Dictionary } from "../../common/types";
import { Row, Col, Button, Input, Label } from "reactstrap";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import GridBase from "../../components/Common/Base/GridBase";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../common/hooks";
import { eqpColumnDefs, modelColumnDefs, operColumnDefs } from "./ModelOperExtNewDefs";
import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from "react";
import AutoCombo from "../../components/Common/AutoCombo";
import { useTranslation } from "react-i18next";
import { CellClickedEvent, GetRowIdFunc, GetRowIdParams, RowClassParams, RowClickedEvent, RowDataUpdatedEvent, RowSelectedEvent, SelectionChangedEvent } from "ag-grid-community";
import { alertBox, confirmBox } from "../../components/MessageBox/Alert";
import { executeIdle } from "../../common/utility";
import Select from "../../components/Common/Select";
import api from "../../common/api";

const ModelOperExtNewList = (props: any) => {
  const { t } = useTranslation();

  const listRef = useRef<any>();
  const [searchRef, getSearch] = useSearchRef();
  const [modelGridRef, setModelList] = useGridRef();
  const [operGridRef, setOperList] = useGridRef();
  const [eqpGridRef, setEqpList] = useGridRef();
  const { refetch } = useApi("modeloperextnew/erpmodel", getSearch, modelGridRef); 
  const { refetch: operRefetch, post, del } = useApi("modeloperextnew", () => {
    return { modelCode: getSelectedModel().modelCode, approveYn:  getSearch().approveYn};
  }, operGridRef); 

  const[approvedoper,setAppropvedOper] = useState<number[]>([]);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;
      setModelList(list);
      modelGridRef.current!.api.deselectAll();

      setOperList([]);
      setEqpList([]);
    }
  };

  const operSearchHandler = async (_?: Dictionary) => {
    const result = await operRefetch();
    const approvedoperList = await api<any>("get","modeloperextnew/approvedoper",{
      modelCode: getSelectedModel().modelCode, approveYn:  getSearch().approveYn
    })
    
    if(result.data && approvedoperList.data) {
      const list: Dictionary[] = result.data;
      setOperList(list);
      setEqpList([]);
      setAppropvedOper(approvedoperList.data.map((m:any)=> m["operationSeqNo"]));
    }
  };

  const getSelectedModel = () => {
    const rows = modelGridRef.current!.api.getSelectedRows();
    return rows[0];
  }

  const getSelectedOper = () => {
    const rows = operGridRef.current!.api.getSelectedRows();
    return rows[0];
  }

  useEffect(() => {
    searchHandler();
  }, []);

  const modelRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;
    
      operSearchHandler();
  }

  const operRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;
      
      const list = e.node.data.operEqpList;

      list.sort((a: Dictionary, b: Dictionary) => a.eqpCode.localeCompare(b.eqpCode));
    
      setEqpList(list);
  }

  //공정명 클릭 이벤트 수정 - 문제시 operRowSelectedHandler() 살릴 것
  const operNameSelectedHandler = (event:CellClickedEvent) => {
    operGridRef.current?.api.deselectAll();

    if(event.rowIndex !== null){
      operGridRef.current?.api.getRowNode(event.rowIndex?.toString())?.setSelected(true);

      const list = [...event.data["operEqpList"]].sort((a: Dictionary, b: Dictionary) => a.eqpCode.localeCompare(b.eqpCode));

      setEqpList(list);
    }
  }

  const eqpSelectionChangedHandler = (e: SelectionChangedEvent) => {
    const rows = operGridRef.current!.api.getSelectedRows();
    if(rows.length <= 0)
      return;

    const row = rows[0];
    if(row.operEqpList.length <= 0)
      return;

    var selectedRows = e.api.getSelectedRows();
    
    for(let i = 0; i < row.operEqpList.length; i++){
      var eqp = row.operEqpList[i];

      if(selectedRows.some(x => x.eqpCode == eqp.eqpCode))
        eqp.useYn = 'Y';
      else
        eqp.useYn = 'N';
    }

    row.operEqpJson = JSON.stringify(row.operEqpList);
  }

  const saveHandler = async () => {
    const modelCode = getSelectedModel()?.modelCode;
    if(!modelCode){
      alertBox(t("@MSG_NO_MODEL_SELECTED")); //선택된 모델이 없습니다.
      return;
    }

    const oper = getSelectedOper();
    if(!oper){
      alertBox(t("@MSG_NO_OPERATION_SELECTED"));//선택된 공정이 없습니다.
      return;
    }

    const param: Dictionary = {};
    param[modelCode] = [oper];

    const result = await post(param);
    if (result.data > 0) {
      alertBox(t("@MSG_SAVE_IS_COMPLETE")); //저장이 완료되었습니다.
    }
    else {
      alertBox(t('@NG_APPROVAL_ERR'));
      return;
    }
  }

  const saveAllHandler = async () => {
    const modelCode = getSelectedModel()?.modelCode;
    if(!modelCode){
      alertBox(t("@MSG_NO_MODEL_SELECTED")); //선택된 모델이 없습니다.
      return;
    }

    confirmBox("@MSG_WANT_BATCH_SAVE", async () => { //일괄저장하시겠습니까?
      confirmBox("@MSG_DELETE_REASK", async () => { //"일괄저장 시 다른 유저의 데이터가 삭제될 수 있습니다. 그래도 일괄저장 하시겠습니까?"
        const param: Dictionary = {};
        param[modelCode] = getAllRows();

        const result = await post(param);
        if (result.data > 0) {
          operSearchHandler();
          executeIdle(() => {
            const rowNode = modelGridRef.current!.api.getRowNode(modelCode)!;
            rowNode.setDataValue("setupYn", "Y");
            alertBox(t("@MSG_BATCH_SAVE_COMPLETED"));
          });
        }
      }, async () => {
      });
    }, async () => {

    });    
  }

  const deleteAllHandler = async () => {
    const modelCode = getSelectedModel()?.modelCode;
    if(!modelCode){
      alertBox(t("@MSG_NO_MODEL_SELECTED"));
      return;
    }

    confirmBox("@DELETE_CONFIRM", async () => {
      confirmBox(t("@MSG_DELETE_REASK"), async () => {
        const param: Dictionary = { "modelCode": modelCode };
  
        const result = await del(param);
        if (result.data > 0) {
          operSearchHandler();
          executeIdle(() => {
            const rowNode = modelGridRef.current!.api.getRowNode(modelCode)!;
            rowNode.setDataValue("setupYn", "");
            alertBox(t("@MSG_BATCH_DELETE_COMPLETED"));
          });        
        }
      }, async () => {
      });
    }, async () => {

    });    
  }

  const getAllRows = () => {
    const rowData: Dictionary[] = [];
    operGridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    return rowData;
  }

  const eqpRowDataUpdated = (e: RowDataUpdatedEvent) => {
    const selectedOperNo = parseInt(operGridRef.current!.api.getSelectedRows()[0]["operationSeqNo"]);

    if(!approvedoper.includes(selectedOperNo))
    {
      e.api.forEachNode((node : any) => node.setSelected(false));
    }
    else {
      e.api.forEachNode((node : any) =>
        node.setSelected(!!node.data && node.data.useYn == 'Y')
      );
    }
  };

  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => {
      return params.data.modelCode;
    };
  }, []);


  return (
    <>
      <ListBase
        folder="System Management"
        title="OperExt"
        postfix="Management"
        icon="bold"
        ref={listRef}
        leftButtons={
          <div className="d-flex gap-2 justify-content-start">
          </div>
        }
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button type="button" color="primary" onClick={saveHandler}>
              <i className="uil uil-pen me-2"/> {`${t("@SAVE_SELECTED_OPERATION")}`}
            </Button>
            {/* <Button type="button" color="success" onClick={saveAllHandler}>
              <i className="uil uil-check-square me-2"></i> 일괄저장
            </Button>
            <Button type="button" color="light" onClick={deleteAllHandler}>
              <i className="uil uil-trash me-2"></i> 일괄삭제
            </Button> */}
          </div>
        }
        search={
          <SearchBase
            ref={searchRef}
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
                <Select name="itemCategoryCode" style={{ maxWidth: "140px" }} placeholder={`${t("@PRODUCT")}/${t("@SEMI_FINISHED_PRODUCT")}`}
                  mapCode="code" category="MODEL_TYPE" 
                  className="form-select"
                  defaultValue={"FG"}
                  required={true} />
              </Col>
              <Col>
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
              </Col>
              <Col>
                <Input name="modelDescription" placeholder={t("@COL_MODEL_NAME")} style={{ minWidth: "250px" }} />
              </Col>
              {/* <Col>
                <select name="setupYn" className="form-select" style={{ minWidth: 160 }}>
                  <option value="">{`${t("@SETTING_YN")}`}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col> */}
              <Col>
                  <select
                    name="approveYn"
                    className="form-select"
                    style={{ minWidth: 130 }}
                  >
                    <option value="">{t("@APPROVAL_STATUS")}</option>
                    <option value="Y">{t("@APPROVAL_COMPLETED")}</option>
                    <option value="N">{t("@APPROVAL_REQUEST")}</option>
                  </select>
                </Col>
            </Row>              
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={4}>
              <div className="pb-2" style={{ height: "100%" }}>
                <div style={{ height: "50%" }}>
                  <GridBase
                    ref={modelGridRef}
                    columnDefs={modelColumnDefs()}
                    onRowSelected={modelRowSelectedHandler}
                    getRowId={getRowId}
                    rowMultiSelectWithClick={false}
                  />
                </div>
                <div style={{ height: "50%" }}>
                  <GridBase
                    ref={eqpGridRef}
                    columnDefs={eqpColumnDefs()}                    
                    rowSelection={'multiple'}
                    onSelectionChanged={eqpSelectionChangedHandler}
                    onRowDataUpdated={eqpRowDataUpdated}
                    aggregateOnlyChangedColumns= {true}
                    />
                </div>
              </div>
            </Col>
            <Col md={8}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={operGridRef}
                  columnDefs={operColumnDefs()}
                  //onRowSelected={operRowSelectedHandler}
                  suppressRowClickSelection={true}
                  onCellClicked={(event: CellClickedEvent) => {
                    operNameSelectedHandler(event);
                    // if(event.colDef.field == "operationSeqNo" || event.colDef.field == "operationCode" || event.colDef.field == "operationDesc"){
                    //   event.node.setSelected(true);
                    // }
                  }}
                  className="ag-grid-groupheader"
                  rowClassRules={{
                    'row-disable-container': (param: RowClassParams) => { return param.data.operYn == 'N' || !param.data.operYn; },
                    'row-enable-container': (param: RowClassParams) => { return param.data.operYn == 'Y' || param.data.operYn == 'O'; },
                  }}
                />
              </div>
            </Col>
          </Row>
      </ListBase>
    </>
  );
};

export default ModelOperExtNewList;
