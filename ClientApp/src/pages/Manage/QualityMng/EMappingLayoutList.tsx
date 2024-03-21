import { Dictionary } from "../../../common/types";
import { Row, Col, Button, Input, Label, Card, CardHeader, InputGroup, InputGroupText, CardBody, Form } from "reactstrap";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import GridBase from "../../../components/Common/Base/GridBase";
import { setFormData, useApi, useEditRef, useGridRef, useSearchRef, useSubmitHandler } from "../../../common/hooks";
import { CellDoubleClickedEvent, GetRowIdFunc, GetRowIdParams, RowSelectedEvent } from "ag-grid-community";
import { columnDefs } from "./EMappingLayoutDefs";
import { useEffect, useMemo, useRef, useTransition } from "react";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import { useTranslation } from "react-i18next";
import { executeIdle } from "../../../common/utility";
import AutoCombo from "../../../components/Common/AutoCombo";
import EMappingLayoutEdit from "./EMappingLayoutEdit";
import api from "../../../common/api";
import style from "./EMapping.module.scss";

export type ReverseMaxtrix = {
  [key: number]: { [key in  "x" | "y" | "aoi" | "bbt" | "blackhole" | "aoiTotal" | "bbtTotal" | "blackholeTotal"]?: number };
};

const EMappingLayoutList = (props: any) => {
  const { t } = useTranslation();

  const editRef = useRef<any>();
  const spinnerRef = useRef<any>();
  const formRef = useRef<any>();
  const submitByRef = useRef<any>();
  const cardRef = useRef<any>();

  const saveRef = useRef<any>();
  const cancelRef = useRef<any>();
  const delRef = useRef<any>();

  const listRef = useRef<any>();
  const pageNo = useRef<number>(1);
  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();

  const modelCodeNewRef = useRef<any>();

  const { refetch, post, put, del } = useApi("emapping/layout", () => {
    const params = getSearch()
    params["pageNo"] = pageNo.current;
    params["pageSize"] = 100;

    return params;
  }, gridRef); 

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data){
      const list: Dictionary[] = result.data;      
      setList(result.data);

      listRef.current.setPaging(pageNo.current, 100, list[0]?.totalCount);

      gridRef.current!.api.deselectAll();

      cancelHandler();
    }
  };

  const pagingHandler = (page: number) => {
    pageNo.current = page;
    searchHandler();
  }

  const showLoading = (isShow: boolean) => {
    executeIdle(() => {
      if(spinnerRef.current)
        spinnerRef.current.style.display = isShow ? "block" : "none";
    });
  }

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    cardRef.current.style.display = "block";

    setFormData(formRef.current, e.data);

    editRef.current.setHVEx(e.data);
    editRef.current.setPcsListEx(e.data);

    saveRef.current.style.display = "block";
    cancelRef.current.style.display = "block";
    delRef.current.style.display = "block";
  }

  const layoutSubmitHandler = useSubmitHandler((formData: FormData, row: Dictionary) => {
    switch (row.submitBy){
      case "set":
      {
        editRef.current.setHVEx(row);
        break;
      }
      case "reset":
      {
        editRef.current.setPcsListEx({ pcsJson: "{}" });
        break;
      }
      case "save":
      {
        saveHandler(row);
        break;
      }
    }
  });

  const addHandler = async () => {
    const val = modelCodeNewRef.current.getValue();
    if(!val?.value){
      alertBox(t("@SELECT_ADD_MODEL_CODE")); //추가할 모델코드를 선택해 주세요.
      return;
    }

    showLoading(true);

    const result = await api<Dictionary>("get", "emapping/layout/select", { modelCode: val.value });
    if(result.data){
      alertBox(t("@ALREADY_SET_MODEL")); //이미 설정된 모델입니다.
      showLoading(false);
      return;
    }

    gridRef.current!.api.deselectAll();

    cardRef.current.style.display = "block";

    setFormData(formRef.current, { modelCode: val.value, pcsPerH: 5, pcsPerV: 5, remark: "" });
    editRef.current.setHVEx({ pcsPerH: 5, pcsPerV: 5 });
    editRef.current.setPcsListEx({ pcsJson: "{}" });

    saveRef.current.style.display = "block";
    cancelRef.current.style.display = "block";
    delRef.current.style.display = "none";

    showLoading(false);
  }

  const saveHandler = async (row: Dictionary) => {
    const pcsList = editRef.current.getPcsList();

    if(Object.keys(pcsList).length == 0){
      alertBox(t("@NOT_SET_PCS")); //설정된 피스가 없습니다.
      return 0;
    }

    showLoading(true);

    row.pcsJson = JSON.stringify(editRef.current.getPcsList());
    
    if(delRef.current.style.display != "block"){ // 추가
      const result = await put(row);
      if(result.data > 0){
        searchHandler();

        cancelHandler();
        alertBox(t("@MSG_SAVED")); //저장되었습니다.
      }
    }else{ // 수정
      const result = await post(row);
      if(result.data > 0){
        searchHandler();

        cancelHandler();
        alertBox(t("@MSG_SAVED")); //저장되었습니다.
      }
    }

    saveRef.current.style.display = "none";
    cancelRef.current.style.display = "none";
    delRef.current.style.display = "none";

    showLoading(false);
  }

  const cancelHandler = async () => {
    gridRef.current!.api.deselectAll();

    cardRef.current.style.display = "none";

    setFormData(formRef.current, { modelCode: "", pcsPerH: "", pcsPerV: "", remark: "" });
    editRef.current.setHVEx({ pcsPerH: 0, pcsPerV: 0 });
    editRef.current.setPcsListEx({ pcsJson: "{}" });

    saveRef.current.style.display = "none";
    cancelRef.current.style.display = "none";
    delRef.current.style.display = "none";
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(!rows.length){
      alertBox(t("@MSG_ALRAM_TYPE7")); //삭제할 행을 선택해 주세요.
      return;
    }

    confirmBox(t("@DELETE_CONFIRM"), async () => { //삭제하시겠습니까?
      showLoading(true);

      const result = await del(rows[0]);
      if(result.data > 0){
        searchHandler();

        cancelHandler();
        alertBox(t("@DELETE_CONFIRM")); //삭제되었습니다.
      }

      showLoading(false);
    }, async () => {

    });    
  }

  useEffect(() => {
    searchHandler();
  }, []);


  return (
    <>
      <ListBase
        ref={listRef}
        showPagination={true}
        onPaging={pagingHandler}      
        leftButtons={
          <>
            <Row>
              <Col>
                <div className="d-flex gap-2">
                  <AutoCombo ref={modelCodeNewRef} name="modelCodeNew" placeholder={t("@COL_MODEL_CODE")} mapCode="model" sx={{ width: "200px" }} /> {/*모델코드*/}
                  <Button type="button" color="primary" onClick={addHandler}>
                    <i className="uil uil-plus me-2"></i> {t("@ADD_MODEL")} {/*모델코드*/}
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        }
        buttons={
          <>
            <Row>
              <Col>
                <div className="d-flex gap-2 justify-content-end">
                  <Button innerRef={saveRef} type="submit" color="primary" form="layoutForm" onClick={() => {
                    submitByRef.current.value = "save";
                  }} style={{ display: "none" }}>
                    <i className="uil uil-pen me-2"></i> {t("@SAVE")}
                  </Button>
                  <Button innerRef={cancelRef} type="button" color="secondary" onClick={cancelHandler} style={{ display: "none" }}>
                    <i className="uil uil-times me-2"></i> {t("@CANCEL")}
                  </Button>
                  <Button innerRef={delRef} type="button" color="light" onClick={deleteHandler} style={{ display: "none" }}>
                    <i className="uil uil-trash me-2"></i> {t("@DELETE")}
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        }
        search={
          <SearchBase
            ref={searchRef} 
            searchHandler={searchHandler}
          >
            <Row>
              <Col>
                <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} mapCode="model" sx={{ width: "200px" }} /> {/* 모델코드 */}
              </Col>
              <Col>
                <Input name="remark" placeholder={t("@REMARK")} style={{ minWidth: "300px" }} /> {/* 설명 */}
              </Col>
            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "100%" }}>
            <Col md={4}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={columnDefs()}
                  onRowSelected={rowSelectedHandler}
                  rowMultiSelectWithClick={false}
                />
              </div>
            </Col>
            <Col md={8}>
              <div className="pb-2" style={{ height: "100%" }}>
                <div className={style.layoutEditContainer}>
                  <div ref={spinnerRef} className="chart-spinner-wrap">
                    <div className="chart-spinner">
                      <div className="spinner-border text-primary">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  </div>
                  <Card style={{ height: "100%" }}>
                    <CardHeader>
                      <div ref={cardRef} style={{ display: "none" }}>
                        <Form
                          id="layoutForm"
                          innerRef={formRef}
                          
                          onSubmit={layoutSubmitHandler}>
                          <input ref={submitByRef} type="hidden" name="submitBy" />
                          <input type="hidden" name="modelCode" />
                          <Row>
                            <Col md={4}>
                              <Row>
                                <Col md={4}>
                                  <InputGroup>
                                    <InputGroupText style={{ display: "inline-block", minWidth: "45px", paddingRight: "10px", textAlign: "center" }}>
                                      {`${t("@HORIZONTAL")}:`} {/*가로:*/}
                                    </InputGroupText>
                                    <Input name="pcsPerH" type="number"
                                      required={true} autoComplete="off" style={{ fontSize: "14px", fontWeight: "bold" }} />
                                  </InputGroup>
                                </Col>
                                <Col md={4}>
                                  <InputGroup>
                                    <InputGroupText style={{ display: "inline-block", minWidth: "45px", paddingRight: "10px", textAlign: "center" }}>
                                     {`${t("@VERTICAL")}:`} {/*세로:*/}
                                    </InputGroupText>
                                    <Input name="pcsPerV" type="number"
                                      required={true} autoComplete="off" style={{ fontSize: "14px", fontWeight: "bold" }} />
                                  </InputGroup>
                                </Col>
                                <Col md={4}>
                                  <Button type="submit" color="primary" onClick={() => {
                                    submitByRef.current.value = "set";
                                  }}>
                                    <i className="uil uil-pen me-2"></i>{t("@RESET_KO")} {/*재설정*/}
                                  </Button>
                                </Col>

                              </Row>
                            </Col>
                            <Col md={3}>
                              <div className="mt-2">
                                {t("@CLICK_ORDER_PCS")} {/*빈칸을 PCS 순서대로 클릭해주세요.*/}
                              </div>
                            </Col>
                            <Col md={3}>
                              <Input name="remark" placeholder={t("@REMARK")} /> {/*설명*/}
                            </Col>
                            <Col md={2}>
                              <div className="d-flex justify-content-end">
                                <Button type="submit" color="info" onClick={() => {
                                  submitByRef.current.value = "reset";
                                }}>
                                  <i className="uil uil-redo me-2"></i> {t("@RESET")} {/*리셋*/}
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Form>
                      </div>
                    </CardHeader>
                    <CardBody>
                      <EMappingLayoutEdit 
                        ref={editRef}
                      />
                    </CardBody>
                  </Card>
                </div>
              </div>
            </Col>
          </Row>
      </ListBase>
    </>
  );
};

export default EMappingLayoutList;
