import { CellDoubleClickedEvent, RowSelectedEvent } from "ag-grid-community";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Col, Input, Row } from "reactstrap";
import api from "../../../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import { Dictionary } from "../../../../common/types";
import AutoCombo from "../../../../components/Common/AutoCombo";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import { alertBox, confirmBox } from "../../../../components/MessageBox/Alert";
import { eqpDefs, eqpParamDefs, offsetDefs, paramDefs, speedParamDefs } from "./EqpOffsetDefs";
import EqpOffsetEdit from "./EqpOffsetEdit";

const EqpOffsetList = () => {

  const { t } = useTranslation();
  
  const [searchRef, getSearch] = useSearchRef();
  const [eqpRef, setEqpList] = useGridRef();
  const [offsetRef, setOffsetList] = useGridRef();
  const [speedParamRef, setSpeedParamList] = useGridRef();
  const [paramRef, setParamList] = useGridRef();
  const [eqpParamRef, setEqpParamList] = useGridRef();
  const [editRef, setForm, closeModal] = useEditRef();
  const addRef = useRef<any>();
  const addRef2 = useRef<any>();
  const addRef3 = useRef<any>();
  const delRef = useRef<any>();
  const delRef2 = useRef<any>();
  const [categorySeq, setCategorySeq] = useState<Dictionary>([]);

  const { refetch, post, put, del } = useApi("eqpoffset", getSearch, eqpRef);

  useEffect(() => {
    searchHandler();
  }, []);

  const getSelectedEqp = () => {
    const rows = eqpRef.current!.api.getSelectedRows();
    return rows[0];
  }
  
  const getSelectedOffset = () => {
    const rows = offsetRef.current!.api.getSelectedRows();
    return rows[0];
  }

  const getSelectedParam = () => {
    const rows = eqpParamRef.current!.api.getSelectedRows();
    return rows;
  }

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    
    if(result.data)
      setEqpList(result.data);
      setOffsetList([]);
      setSpeedParamList([]);
      setParamList([]);
      setEqpParamList([]);
      
      addRef.current.disabled = true;
      addRef2.current.disabled = true;
      addRef3.current.disabled = true;
      delRef.current.disabled = true;
      delRef2.current.disabled = true;
  };

  const eqpSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    addRef.current.disabled = false;
    addRef2.current.disabled = false;
    addRef3.current.disabled = false;
    delRef.current.disabled = false;
    delRef2.current.disabled = false;
    
    eqpOffsetSearchHandler(e.data.eqpCode);
  }
  
  const eqpOffsetSearchHandler = async (eqpCode: string) => {
    api<any>("get" ,"eqpoffset/category", { eqpCode }).then((result) => {
      if(result.data){
        setOffsetList(result.data);
        setCategorySeq(result.data[0]);
        setSpeedParamList([{speedParamName: result.data[0].speedParamName, eqpCode: result.data[0].eqpCode}]);
        setParamList([]); 
      }
    });
    
    api<any>("get" ,"eqpoffset/param", { eqpCode }).then((result) => {
      if(result.data){
        setEqpParamList(result.data);
      }
    });
  }

  const offsetSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    api<any>("get" ,"eqpoffset/registparam", e.data).then((result) => {
      if(result.data)
        setParamList(result.data); 
    });
    
  }

  const editCompleteHandler = async (row: Dictionary, initRow: Dictionary) => {
    const newRow = {...initRow, ...row};
    if(newRow.eqpareagroupSeq == "-")  
      newRow.eqpareagroupSeq = 0;

    if(initRow.gubun){
        const result = await post(newRow);
        if(result.data > 0){
          eqpOffsetSearchHandler(getSelectedEqp().eqpCode);
          closeModal();
          alertBox(t("@MSG_ALRAM_TYPE13"));  //수정이 완료되었습니다.
        }
    }else{
      const result = await put(newRow);
      if(result.data > 0){
        eqpOffsetSearchHandler(getSelectedEqp().eqpCode);
        closeModal();
        alertBox(t("@MSG_ALRAM_WRITE_CMPLT"));  //작성이 완료되었습니다.
      }else if(result.data == -1){
        //`동일한 항목이 존재합니다.<br />설비코드: ${newRow.eqpCode}`
        alertBox(`${t("@MSG_ALRAM_TYPE11")}<br />${t("@COL_EQP_CODE")}: ${newRow.eqpCode}`);
      }
    }
  }

  const deleteHandler = async () => {
    const rows = offsetRef.current!.api.getSelectedRows();
    if(!rows.length) {
      alertBox(t("@MSG_ALRAM_TYPE7"));  //삭제할 행을 선택해 주세요.
      return;
    }
    
    confirmBox(t("@ASK_DELETE_EQP_STEP"), async () => {  //해당 설비단을 삭제하시겠습니까?
      const result  = await del(rows[0]);
      if(result.data > 0) {
        eqpOffsetSearchHandler(getSelectedEqp().eqpCode);
        alertBox(t("@DELETE_COMPLETE"));  //삭제되었습니다.
      }
    }, () => {

    });
  }

  const editHandler = () => {
    const eqp = getSelectedEqp();
    if(!categorySeq) {
      setForm({ eqpCode: eqp.eqpCode, eqpareagroupSeq: 0, eqpareaSeq: 1});  
    }else {
      setForm({ eqpCode: eqp.eqpCode, eqpareagroupSeq: categorySeq.maxLSeq, eqpareaSeq: categorySeq.maxMSeq + 1});  
    }
  }

  const speedPparamRegistHandler = () => {
    const param = getSelectedParam();

    if(param.length == 0) {
      alertBox(t("@SELECT_REGISTER_PARAMETER"));   //"등록시킬 파라미터를 선택해 주세요."
      return;
    }

    if(param.length > 1) {
      alertBox(t("SELECT_ONE_SPEED_PARAMETER"));  //속도 파라미터는 하나만 선택해 주세요.
      return;
    }

    let updateParam: Dictionary = {
        eqpCode: param[0].eqpCode,
        paramId: param[0].paramId,
    }
  
    speedParamUpdateHandler(updateParam);
  }

  const speedParamDelete = (e: CellDoubleClickedEvent) => {

    let updateParam: Dictionary = {
      eqpCode: e.data.eqpCode,
      paramId: null,
    }

    confirmBox(t("@ASK_CANCEL_REGISTER"), () => {   //등록 취소하시겠습니까?
      speedParamUpdateHandler(updateParam);
    }, () => {

    });
  }

  const speedParamUpdateHandler= (param: Dictionary) => {
    api<any>("post", 'eqpoffset/speedRegistparam', param).then((result) => {
      if(result.data > 0){
        eqpOffsetSearchHandler(getSelectedEqp().eqpCode);
        alertBox(t("@MSG_COMPLETED")); //완료되었습니다.
      }
    });
  }

  

  const paramRegistHandler = () => {
    const offset = getSelectedOffset();
    const param = getSelectedParam();
    if(!offset) {
      alertBox(t("@SELECT_EQP_STEP"));  //등록시킬 설비단을 선택해 주세요.
      return;
    }

    if(param.length == 0) {
      alertBox(t("@SELECT_REGISTER_PARAMETER"));  //"등록시킬 파라미터를 선택해 주세요.
      return;
    }

    const data: Dictionary = {
      extId: offset.extId,
      param: param
    }

    api<any>("put", 'eqpoffset/registparam', data).then((result) => {
      if(result.data > 0){
        eqpOffsetSearchHandler(getSelectedEqp().eqpCode);
        alertBox(t("@MSG_COMPLETED"));     //완료되었습니다.
      }
    });
    
  }

  const paramCancelHandler = () => {
    const rows = paramRef.current!.api.getSelectedRows();

    if(!rows.length) {
      alertBox(t("@SELECT_CANCEL_PARAMETER"));  //취소할 파라미터를 선택해 주세요.
      return;
    }

    let mapList = rows?.map(item => item.mapId).join(', ');
 
    confirmBox(t("@ASK_CANCEL_REGISTER"), () => {   //등록 취소하시겠습니까?
      api<any>("delete", 'eqpoffset/registparam', {mapIdList: mapList}).then((result) => {
        if(result.data > 0){
          eqpOffsetSearchHandler(getSelectedEqp().eqpCode);
          alertBox(t("@MSG_DO_CANCEL"));     //취소되었습니다.
        }
      });
     
    }, () => {

    });

  }

  const barcodeHandler = () => {
    let data: any = [];

    eqpRef.current!.api.forEachNode((rowNode: any, index: any) => {
      if(rowNode.data.barcodeYn)
        data = [...data,rowNode.data];
    });

    api<any>("post", "eqpoffset/barcode", data).then((result) => {
      if(result.data) {
        searchHandler();
        alertBox(t("@SAVE_COMPLETE_BARCODE_EQP"));  //바코드 사용설비 저장 완료 되었습니다.
      }else {

      }
    });

  }

  return(
    <>
      <ListBase
           editHandler={() => {
            setForm({});
          }}
          folder="Reference Management"
          title="EqpOffset"
          postfix="Management"
          icon="tool"
          leftButtons={
            <div className="d-flex gap-2 justify-content-start">
              <Button type="button" color="light" onClick={barcodeHandler}>
                {/* 일괄저장 */}
                <i className="uil uil-pen me-2"></i> {t("@TOTAL_SAVE")}
              </Button>
            </div>
          }
          buttons={
            <div className="d-flex gap-2 justify-content-end">
              <Button innerRef={addRef} type="button" color="primary" onClick={editHandler}>
                <i className="uil uil-pen me-2"></i> {t("@SAVE")}
              </Button>
              <Button innerRef={delRef} type="button" color="light" onClick={deleteHandler}>
                <i className="uil uil-trash me-2"></i> {t("@DELETE")}
              </Button>
              <Button innerRef={addRef2} type="button" color="primary" onClick={speedPparamRegistHandler}>
                {/* 속도 Parameter 등록 */}
                <i className="uil uil-pen me-2"></i>{`${t("@SPEED")} ${t("@PARAMETER")} ${t("@REGIST")}`}
              </Button>
              <Button innerRef={addRef3} type="button" color="primary" onClick={paramRegistHandler}>
              {/* Parameter 등록 */}
                <i className="uil uil-pen me-2"></i> {`${t("@PARAMETER")} ${t("@REGIST")}`}
              </Button>
              <Button innerRef={delRef2} type="button" color="light" onClick={paramCancelHandler}>
              {/* Parameter 등록 취소 */}
                <i className="uil uil-trash me-2"></i> {`${t("@PARAMETER")} ${t("@REGIST")} ${t("@CANCEL")}`}
              </Button>
            </div>
          }
          search={
            <SearchBase ref={searchRef} searchHandler={searchHandler}>
              <Row>
                <Col size="auto">
                    {/* 설비코드 */}
                  <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />
                </Col>
                <Col>
                  <select name="barcodeYn" defaultValue={"Y"} className="form-select" style={{ minWidth: 130 }}>
                    <option value="">{t("@BARCODE_EQP")}</option>
                    <option value="Y">Y</option>
                  </select>
                </Col>
              </Row>
            </SearchBase>
          }
        >
          <Row style={{ height: "100%" }}>
            <Col md={6}>
              <Col className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={eqpRef}
                  columnDefs={eqpDefs()}
                  onRowSelected={eqpSelectedHandler}
                />
              </Col>
            </Col>
            <Col md={6}>
              <Row style={{ height: "70%" }}>
                <Col md={10}>
                  <Col className="pb-2" style={{ height: "100%" }}>
                    <GridBase
                      ref={offsetRef}
                      columnDefs={offsetDefs()}
                      onRowSelected={offsetSelectedHandler}
                      onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
                        setForm({...e.data, gubun: "edit"});
                      }}
                    />
                  </Col>
                </Col>
                <Col md={2}>
                  <Col className="pb-2" style={{ height: "100%" }}>
                    <Row style={{ height: "75px" }}>
                      <Col>
                        <GridBase
                          ref={speedParamRef}
                          columnDefs={speedParamDefs()}
                          onCellDoubleClicked={(e: CellDoubleClickedEvent) => {
                            speedParamDelete(e);
                          }}
                        />  
                      </Col>
                    </Row>
                    <Row style={{ height: "calc(100% - 75px)" }}>
                      <Col>
                        <GridBase
                          ref={paramRef}
                          columnDefs={paramDefs()}
                          rowSelection="multiple"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Col>
              </Row>
              <Row style={{ height: "30%" }}>
                <Col>
                  <Col className="pb-2" style={{ height: "100%" }}>
                    <GridBase
                      ref={eqpParamRef}
                      columnDefs={eqpParamDefs()}
                      rowSelection="multiple"
                    />
                  </Col>
                </Col>
              </Row>
            </Col>
          </Row>
      </ListBase>
      <EqpOffsetEdit ref={editRef} onComplete={editCompleteHandler} />
    </>
  );
}

export default EqpOffsetList;