import { CellClickedEvent, RowClassParams, RowDataUpdatedEvent, RowSelectedEvent } from "ag-grid-community";
import { useTranslation } from "react-i18next";
import { Button, Col, Form, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef, useSubmitHandler, useSubmitRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import { gapDefs, modelDefs, operDefs } from "./FdcOperStdDefs";
import AutoCombo from "../../../components/Common/AutoCombo";
import api from "../../../common/api";
import { useEffect, useRef, useState } from "react";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import Select from "../../../components/Common/Select";
import { showLoading } from "../../../common/utility";
import style from "./FdcInterlock.module.scss";

const FdcOperStdList = () => {
  const { t } = useTranslation();

  const [aoiFormRef, setAOIForm] = useSubmitRef();
  const [bbtFormRef, setBBTForm] = useSubmitRef();

  const [searchRef, getSearch] = useSearchRef();
  const [modelGridRef, setModelList] = useGridRef();
  const [stdOperGridRef, setStdOperList] = useGridRef();
  const [gapOperGridRef, setGapOperList] = useGridRef();

  const aoiOperRef = useRef<any>();
  const aoiDefectRef = useRef<any>();

  const bbtOperRef = useRef<any>();
  const bbtDefectRef = useRef<any>();

  const operList = useRef<Dictionary[]>([]);

  const { refetch } = useApi("fdcinterlock/model", getSearch, modelGridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) 
      setModelList(result.data);
      setStdOperList([]);
      setGapOperList([]);
      clearDefectForm();
  };

  const modelSelectedHandler = (e: RowSelectedEvent) => {
    if (!e.node.isSelected()) return;

    stdOperSearchHandler(e.data.modelCode);
  };

  const stdOperSearchHandler = async (modelCode: string) => {
    showLoading(stdOperGridRef, true);
    showLoading(gapOperGridRef, true);

    api<any>("get", "fdcinterlock/stdoper", { modelCode }).then(result => {
      if(result.data?.length){
        operList.current = result.data;

        bindStdOperList();
        clearDefectForm();
      }else{
        //alertBox("대상 공정이 없습니다.");
        alertBox(t("@MSG_ALRAM_TYPE19"));
        showLoading(stdOperGridRef, false);
        setStdOperList([])
        return;
      }
    });

    api<any>("get", "fdcinterlock/gapoper", { modelCode }).then(result => {
      if(result.data?.length){
        setGapOperList(result.data);
  
      }else{
        showLoading(gapOperGridRef, false);
        setGapOperList([])
        return;
      }
    });
  };

  const clearDefectForm = () => {
    aoiOperRef.current.setValue({ value: "", label: "" });
    aoiOperRef.current.setEmpty();
    aoiDefectRef.current.setValue({ value: "", label: "" });
    aoiDefectRef.current.setEmpty();

    bbtOperRef.current.setValue({ value: "", label: "" });
    bbtOperRef.current.setEmpty();
    bbtDefectRef.current.setValue({ value: "", label: "" });
    bbtDefectRef.current.setEmpty();
  }

  const bindStdOperList = () => {
    const list = operList.current;

    setStdOperList(list.filter((x: Dictionary) => !x.defectType || !!x.defectRate || x.setted));

    aoiOperRef.current.setMaps(getOperOptions(list, "AOI"));
    aoiDefectRef.current.setMaps(getDefectOptions(list, "AOI"));

    bbtOperRef.current.setMaps(getOperOptions(list, "BBT"));
    bbtDefectRef.current.setMaps(getDefectOptions(list, "BBT"));
  };

  const getOperOptions = (list: Dictionary[], operType: string) => {
    const options: Dictionary[] = [];
    options.push({ value: "", label: "" });
    list.filter((x: Dictionary) => x.operType == operType).forEach((x: Dictionary) => {
      if(!x.operCode)
        return;

      if(options.find(y => y.value == x.operCode))
        return;

      options.push({ value: x.operCode, label: x.operName, parent: x.operSeqNo });
    });

    return options;
  }

  const getDefectOptions = (list: Dictionary[], operType: string) => {
    const options: Dictionary[] = [];
    options.push({ value: "", label: "" });
    list.filter((x: Dictionary) => x.operType == operType).forEach((x: Dictionary) => {
      if(!x.defectType)
        return;

      if(options.find(y => y.value == x.defectType))
        return;

      options.push({ value: x.defectType, label: x.defectName });
    });

    return options;
  }

  const addAOIDefectHandler = useSubmitHandler((formData: FormData, data: Dictionary) => {
    const oper = aoiOperRef.current.getValue();
    
    const find = operList.current.find((x: Dictionary) => 
      x.operSeqNo == oper.parent && 
      x.operCode == data.aoiOperCode && 
      x.defectType == data.aoiDefectType);

    if(!find){
      alertBox(t("@ERROR_ADD_ITEM"));  //추가중 오류가 발생했습니다.
      return;
    }

    if(find.setted){
      alertBox(t("@ALREADY_ADDED_ITEM"));  //이미 추가된 항목입니다.
      return;
    }

    find.setted = true;

    bindStdOperList();
  });

  const addBBTDeatilHandler = useSubmitHandler((formData: FormData, data: Dictionary) => {
    const oper = bbtOperRef.current.getValue();
    
    const find = operList.current.find((x: Dictionary) => 
      x.operSeqNo == oper.parent && 
      x.operCode == data.bbtOperCode && 
      x.defectType == data.bbtDefectType);

    if(!find){
      alertBox(t("@ERROR_ADD_ITEM"));  //추가중 오류가 발생했습니다.
      return;
    }

    if(find.setted){
      alertBox(t("@ALREADY_ADDED_ITEM"));  //이미 추가된 항목입니다.
      return;
    }

    find.setted = true;

    bindStdOperList();
  });

  const getStdOperAllRows = () => {
    const rowData: Dictionary[] = [];
    stdOperGridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    return rowData;
  }

  const getGapOperAllRows = () => {
    const rowData: Dictionary[] = [];
    gapOperGridRef.current!.api.forEachNode((node: any) => rowData.push(node.data));
    return rowData;
  }

  const editCompleteHandler = async () => {
    const rows = modelGridRef.current!.api.getSelectedRows();
    if(rows.length <= 0){
      //alertBox("선택된 모델이 없습니다.");
      alertBox(t("@MSG_NO_MODEL_SELECTED"));
      return;
    }

    const stdOperList = getStdOperAllRows();
    const gapOperList = getGapOperAllRows();

    if(stdOperList.length <= 0 && gapOperList.length <= 0){
      //alertBox("공정이 없습니다.");
      alertBox(t("@MSG_ALRAM_TYPE20"));
      return;
    }

    const merged = gapOperList.concat(stdOperList);

    const param = rows[0];
    param.json = JSON.stringify(merged);

    confirmBox(t("@MSG_WANT_BATCH_SAVE"), async () => { //일괄저장하시겠습니까?
      const result = await api<any>("post", "fdcinterlock/defectrate", param);
    
      if(result.data > 0){
        alertBox(t("@MSG_BATCH_SAVE_COMPLETED"));

        stdOperSearchHandler(param.modelCode);
      }
    }, async () => {
    });
  }

  const deleteHandler = async () => {
    const rows = modelGridRef.current!.api.getSelectedRows();
      if (rows.length <= 0) {
        alertBox("@MSG_ALRAM_TYPE21");
        //alertBox("선택된 모델이 없습니다.");
      return;
    }

    const param = rows[0];

    confirmBox(t("@DELETE_CONFIRM"), async () => {
      const result = await api<any>("delete", "fdcinterlock/defectrate", { modelCode:  param.modelCode });
      if(result.data > 0) {
        alertBox(t("@MSG_BATCH_DELETE_COMPLETED"));
        
        stdOperSearchHandler(param.modelCode);
      }
    }, async () => {
    });
  }  

  useEffect(() => {
    //searchHandler();
  }, []);

  return (
    <>
      <ListBase
        className={style.fdcOperWrap}
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            <Button color="primary" onClick={editCompleteHandler}>
              <i className="uil uil-check me-2"></i>
              {t("@TOTAL_SAVE")}
            </Button>
            <Button type="button" color="light" onClick={deleteHandler} >
              <i className="uil uil-trash me-2"></i>
              {t("@TOTAL_DELETE")}
            </Button>
          </div>
        }
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col>
                <Select name="itemCategoryCode" style={{ maxWidth: "140px" }} placeholder={`${t("@PRODUCT")}/${t("@SEMI_FINISHED_PRODUCT")}`}
                  mapCode="code" category="MODEL_TYPE" className="form-select" defaultValue={"FG"} required={true}
                />
              </Col>
              <Col>
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
              </Col>
              <Col>
                <Input name="modelName" placeholder={t("@COL_MODEL_NAME")} style={{ minWidth: "250px" }} />
              </Col>
              <Col>
                <select name="settedYn" className="form-select" style={{ minWidth: 130 }} >
                  <option value="">{t("@COL_SETTING_USE")}</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col md={4} style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={modelGridRef}
                columnDefs={modelDefs()}
                onRowSelected={modelSelectedHandler}
                rowMultiSelectWithClick={false}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
                onGridReady={() => {
                  setModelList([]);
                }}
                rowClassRules={{
                  'fdc-oper-n-row' : (param: RowClassParams) => {
                    return param.data.fdcOperYn == 'N'
                  },
                  'fdc-oper-y-row' : (param: RowClassParams) => {
                    return param.data.fdcOperYn == 'Y'
                  }
                }}
              />
            </div>
          </Col>
          <Col md={8} style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "60%", display: "flex", flexDirection: "column" }}>
              <Row style={{ flexGrow: 1 }} className="pb-1">
                <Col>
                  <GridBase
                    ref={stdOperGridRef}
                    columnDefs={operDefs()}
                    enterNavigatesVertically={true}
                    enterNavigatesVerticallyAfterEdit={true}
                    suppressRowClickSelection={true}
                    singleClickEdit={true}
                    stopEditingWhenCellsLoseFocus={true}
                    rowClassRules={{
                      'unsetted-row': (param: RowClassParams) => { 
                        return param.data.defectRate == null || param.data.defectRate == undefined;
                      },
                      'setted-row': (param: RowClassParams) => { 
                        return param.data.defectRate == 0 || param.data.defectRate > 0;
                      },
                    }}
                    onGridReady={() => {
                      setStdOperList([]);
                    }}
                  />
                </Col>
              </Row>
              <Row style={{ height: "35px" }}>
                <Col md={6}>
                  <Form className="d-flex gap-2 edit-wrap" style={{ height: "31px" }}
                    innerRef={aoiFormRef}
                    onSubmit={addAOIDefectHandler}>
                    <AutoCombo ref={aoiOperRef} name="aoiOperCode" sx={{ maxWidth: "140px" }} placeholder={`AOI${t("@OPERATION")}`} onlyCompareValue={true} required={true} /> {/* AOI공정 */}
                    <AutoCombo ref={aoiDefectRef} name="aoiDefectType" sx={{ maxWidth: "110px" }} placeholder={`AOI${t("@DETAILED_ITEM")}`} onlyCompareValue={true} required={true} />  {/* AOI세부항목 */}
                    <Button type="submit" color="success" style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                      <i className="uil uil-plus me-2"></i>
                      {`AOI ${t("@DETAILED_ITEM")} ${t("@ADD")}`}  {/* AOI 세부항목 추가 */}
                    </Button>
                  </Form>
                </Col>
                <Col md={6}>
                  <Form className="d-flex gap-2 justify-content-end edit-wrap" style={{ height: "31px" }}
                    innerRef={bbtFormRef}
                    onSubmit={addBBTDeatilHandler}>
                    <AutoCombo ref={bbtOperRef} name="bbtOperCode" sx={{ maxWidth: "140px" }} placeholder="BBT공정" onlyCompareValue={true} required={true} />  {/* BBT공정 */}
                    <AutoCombo ref={bbtDefectRef} name="bbtDefectType" sx={{ maxWidth: "110px" }} placeholder="BBT세부항목" onlyCompareValue={true} required={true} />  {/* BBT세부항목 */}
                    <Button type="submit" color="info" style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                      <i className="uil uil-plus me-2"></i>
                      {`BBT ${t("@DETAILED_ITEM")} ${t("@ADD")}`}  {/* BBT 세부항목 추가 */}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </div>
            <div className="pb-2" style={{ height: "40%" }}>
              <GridBase
                ref={gapOperGridRef}
                columnDefs={gapDefs()}
                enterNavigatesVertically={true}
                enterNavigatesVerticallyAfterEdit={true}
                suppressRowClickSelection={true}
                singleClickEdit={true}
                stopEditingWhenCellsLoseFocus={true}
                rowClassRules={{
                  'unsetted-row': (param: RowClassParams) => { 
                    return param.data.defectRate == null || param.data.defectRate == undefined;
                  },
                  'setted-row': (param: RowClassParams) => { 
                    return param.data.defectRate == 0 || param.data.defectRate > 0;
                  },
                }}
                onGridReady={() => {
                  setGapOperList([]);
                }}
              />
            </div>
          </Col>
        </Row>
      </ListBase>
    </>
  );
};

export default FdcOperStdList;
