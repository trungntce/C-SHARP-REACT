import { CellDoubleClickedEvent, RowClassParams, RowHeightParams, RowSelectedEvent, SelectionChangedEvent } from "ag-grid-community";
import moment from "moment";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button, ButtonGroup, Card, CardBody, CardHeader, Col, Input, Label, Modal, Popover, PopoverBody, PopoverHeader, Row, UncontrolledPopover } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary, contentType } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import AutoCombo from "../../../components/Common/AutoCombo";
import { alertBox, confirmBox } from "../../../components/MessageBox/Alert";
import ParamChart from "../../Trace/ParamChart";
import ParamChartEx from "../../Trace/ParamChartEx";
import RecipeChart from "../../Trace/RecipeChart";
import RecipeChartEx from "../../Trace/RecipeChartEx";
import { downloadFile, executeIdle, listToCamelCase, merge, showLoading, yyyymmddhhmmss } from "../../../common/utility";
import style from "./fdcInterlock.module.scss";
import api from "../../../common/api";
import { checkUsergroup, parseUsergroup } from "../../../common/permission";
import { panelDefs } from "../../Trace/PanelDefs";
import WorkorderInterlockOn from "./WorkorderInterlockOn";
import WorkorderInterlockOff from "./WorkorderInterlockOff";
import { fdcInterlockDefs } from "./FdcInterlockDefs";
import FdcHandleEdit from "./FdcHandleEdit";
import FdcSettleEdit from "./FdcSettleEdit";
import { showProgress } from "../../../components/MessageBox/Progress";
import { useTranslation } from "react-i18next";

export const detectStep = (row: Dictionary) => {
  if(row.handleDt && row.settleDt) // 합의가 완료된 경우
    return 'COMPLETE';

  if(row.handleDt) // 처리 등록
    return 'HANDLE';

  return '';
}


//SIFLEX 자체 수정이력 있음
const FdcInterlockList = () => {
  const { t } = useTranslation();
  const paramChartRef = useRef<any>();
  const recipeChartRef = useRef<any>();

  const paramChartRefEx = useRef<any>();
  const recipeChartRefEx = useRef<any>();

  const [processHandleEditRef, setProcessHandleForm, closeProcessHandleModal] = useEditRef();
  const [processSettleEditRef, setProcessSettleForm, closeProcessSettleModal] = useEditRef();

  const [workorderInterlockOnRef, setworkorderInterlockOnForm, closeworkorderInterlockOnModal] = useEditRef();
  const [workorderInterlockOffRef, setworkorderInterlockOffForm, closeworkorderInterlockOffModal] = useEditRef();

  const lotNoRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();
  const [panelGridRef, setPanelList] = useGridRef();

  const { refetch, post, put, del } = useApi("fdcinterlock", getSearch, gridRef); 

  const fromDateRef = useRef<any>();
  const toDateRef = useRef<any>();

  const searchHandler = async (_?: Dictionary) => {
    const search = getSearch();

    const fromDt = moment.utc(search["fromDt"]);
    const toDt = moment.utc(search["toDt"]);

    const duration = moment.duration(toDt.diff(fromDt));
    const days = duration.asDays();

    if(days > 89)
    {
      alertBox(t("@MSG_SELECT_MAX_DAY_90"));  //조회기간은 최대 90일입니다.
      return;
    }

    const result = await refetch();
    if(result.data) {
      setList(result.data);
      setPanelList([]);
    }
  };

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    // if(e.data.prodType != 'M'){
    //   alertBox("양산 모델만 처리 가능합니다.");
    //   e.node.setSelected(false);
    //   return;
    // }      

    let rows = e.api.getSelectedRows();

    if(e.node.isSelected() && rows.length > 1)
    {
      const prevRows = rows.filter(x => x.tableRowNo != e.data.tableRowNo);
      const first = prevRows[0];
  
      if(detectStep(first) != detectStep(e.data)){
        alertBox(t("@MSG_SAME_PROGRESS_BATCH_POSSIBLE")); //같은 진행상태의 Batch만 일괄처리가 가능합니다.
        e.node.setSelected(false);
        return;
      }
  
      if(first.operSeqNo != e.data.operSeqNo || 
        first.operCode != e.data.operCode || 
        first.fdcType != e.data.fdcType){
        alertBox(t("@MSG_SAME_PROGRESS_POSSIBLE"));  //같은 공순, 공정, 구분만 일괄처리가 가능합니다.
        e.node.setSelected(false);
        return;
      }
    }

    bindPanelList();
  }

  const bindPanelList = () => {
    const rows = gridRef.current!.api.getSelectedRows();

    let merged: string = "";
    rows.forEach((x: Dictionary) => {
      merged = `${merged}${merged.length > 0 ? ',' : ''}${x.headerGroupKey}`;
    });

    if(merged){
      showLoading(panelGridRef, true);
      api("get", "fdcinterlock/panel", { "headerGroupKey": merged }).then((result: Dictionary) => {
        if(result.data)
          setPanelList(result.data);
      });
    }else{
      setPanelList([]);
    }
  }

  const selectionChangedHandler = (e: SelectionChangedEvent) => {
  }

  const processDeleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(rows.length <= 0)
    {
      alertBox(t("@MSG_PLEASE_SELECT_ITEM"));  //항목을 선택해 주세요.
      return;
    }

    for(const row of rows){
      // if(row.prodType != 'M'){
      //   alertBox(t("@MSG_ONLY_MASSPRODUCTIONMODEL_PROCESSED"));  //양산 모델만 처리 가능합니다.
      //   return;
      // }       
    }

    const param: Dictionary = {};
    param.json = JSON.stringify(rows);

    //조치+합의 정보만 Batch, Panel 인터락 설정등은 별도로 처리해야합니다. 리셋한 자료된 복구가 불가능합니다. 그래도 리셋 하시겠습니까?
    confirmBox(t("@MSG_NO_ROLLBACK_RESET"), async () => {
      const result = await api<any>("post", "fdcInterlock/processdeletejson", param);
      if(result.data && result.data <= 0){
        alertBox(t("@MSG_ERROR_TYPE1"));  //리셋 중 오류가 발생했습니다.
        return;
      }

      alertBox(t("@MSG_COMPLETED"));  //@MSG_COMPLETED

      searchHandler();
    }, async () => {
    })
  };

  const panelRealtimeInterlockHandler = async (interlockYn: string) => {
    const rows = panelGridRef.current!.api.getSelectedRows();

    if(rows.length <= 0)
    {
      alertBox(t("@MSG_PLEASE_SELECT_PANEL"));  //판넬을 선택해 주세요.
      return;
    }

    const param: Dictionary = {};
    param.interlockYn = interlockYn;
    param.json = JSON.stringify(rows);

    confirmBox(interlockYn == 'Y' ? t("@MSG_ASK_TYPE6") : t("@MSG_ASK_TYPE7"), async () => {  //"판넬에 대한 인터락을 설정하시겠습니까?" : "판넬에 대한 인터락을 해제하시겠습니까?"
      const result = await api<any>("post", "panelinterlock/realtime", param);
      if(result.data && result.data <= 0){
        alertBox(t("@MSG_ERROR_TYPE2"));  //설정 중 오류가 발생했습니다.
        return;
      }

      bindPanelList();

      alertBox(t("@MSG_COMPLETED"));  //완료되었습니다.

      bindPanelList();
    }, async () => {
    })
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if(rows.length <= 0)
    {
      alertBox(t("@MSG_PLEASE_SELECT_PANEL"));  //판넬을 선택해 주세요.
      return;
    }

    const param: Dictionary = {};
    param.json = JSON.stringify(rows);

    confirmBox(t("@MSG_DELETED_NO_RESTORE"), async () => {  //삭제한 자료된 복구가 불가능합니다. 그래도 삭제 하시겠습니까?
      const result = await api<any>("post", "fdcInterlock/deletejson", param);
      if(result.data && result.data <= 0){
        alertBox(t("@MSG_ERROR_TYPE3"));  //삭제 중 오류가 발생했습니다.
        return;
      }

      alertBox(t("@MSG_COMPLETED"));  //완료되었습니다.

      searchHandler();
    }, async () => {
    });
  }

  const getPanelRef = () => {
    const panel = panelDefs().filter(x => x.headerClass != "multi4m" || x.checkboxSelection).filter(x => x.field != 'workorderReal');

    return panel;
  }

  const searchParamHandler = async () => { 
    const params = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams: any, prop: any) => searchParams.get(prop),
    });
    
    const category = params.category;
    const type = params.type;
    if (undefined === category || '' === category || undefined === type || '' === type) { 
      return;
    }
    let fromDt = new Date();
    let toDt = new Date();
    switch (type) {
      case 'lastMonth':
        fromDt = moment(moment().add(-1, 'months').toDate()).startOf('month').toDate();
        toDt = moment(moment().add(-1, 'months').toDate()).endOf('month').toDate();
        break;
      case 'thisMonth':
        fromDt = moment().startOf('month').toDate();
        break;
      case 'week':
        fromDt = moment().startOf('week').subtract(7, 'days').toDate();
        toDt = moment().endOf('week').subtract(7, 'days').toDate();
        break;
      case 'firstDay':
        fromDt = moment().add(-6, 'days').toDate();
        toDt = moment().add(-6, 'days').toDate();
        break;
      case 'secondDay':
        fromDt = moment().add(-5, 'days').toDate();
        toDt = moment().add(-5, 'days').toDate();
        break;
      case 'thirdDay':
        fromDt = moment().add(-4, 'days').toDate();
        toDt = moment().add(-4, 'days').toDate();
        break;
      case 'fourthDay':
        fromDt = moment().add(-3, 'days').toDate();
        toDt = moment().add(-3, 'days').toDate();
        break;
      case 'fifthDay':
        fromDt = moment().add(-2, 'days').toDate();
        toDt = moment().add(-2, 'days').toDate();
        break;
      case 'sixthDay':
        fromDt = moment().add(-1, 'days').toDate();
        toDt = moment().add(-1, 'days').toDate();
        break;
      case 'seventhDay':
        fromDt = new Date();
        toDt = new Date();
        break;
    }

    fromDateRef.current.setDate(fromDt);
    toDateRef.current.setDate(toDt);
    

    executeIdle(() => {
      searchHandler();
    })
      
    // const result = await api<any>("get", "/fdcinterlock", {
    //   fromToDtType: 'I',
    //   fromDt: moment(fromDt).format('YYYY-MM-DD'),
    //   toDt: moment(toDt).format('YYYY-MM-DD')
    // });
    // if (result.data) {
    //   setList(result.data);
    // }
  }

  useEffect(() => {
    searchParamHandler();
  }, []);


  const excelHandler = async (e:any) => {
    e.preventDefault();

    if(gridRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t("@MSG_ALRAM_TYPE4"));  //데이터가 없습니다.
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "fdcinterlock", param);
    downloadFile(`fdc_interlock_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  return (
    <>
      <ListBase
        className={style.fdcInterlockWrap}
        centerCol={1}
        endCol={8}
        leftButtons={
          <div className="d-flex gap-2 justify-content-start">
            {
              checkUsergroup("interlock.prod") ? (
                <>
                  <ButtonGroup>
                    <Button type="button" color="primary" onClick={()=>{
                      const rows = gridRef.current!.api.getSelectedRows();
                      if(rows.length <= 0)
                      {
                        alertBox(t("@MSG_PLEASE_SELECT_PANEL")); //판넬을 선택해 주세요.
                        return;
                      }

                      // for(const row of rows){
                      //   if(row.prodType != 'M'){
                      //     alertBox(t("@MSG_ONLY_MASSPRODUCTIONMODEL_PROCESSED"));  //양산 모델만 처리 가능합니다.
                      //     return;
                      //   }       
                      // }

                      if(!processSettleEditRef.current.setList(rows))
                        return;

                      setProcessSettleForm({ handleCode: rows[0].handleCode });
                      }}>
                      <i className="uil uil-pen me-2"></i>{t("@SELECTIONS_AGREED")}  {/*선택항목 합의*/}
                    </Button>
                  </ButtonGroup>
                </>
              ) : null
            }
          </div>
        }
        buttons={
          <div className="d-flex gap-2 justify-content-end">
            {
              (checkUsergroup("interlock.oper") || checkUsergroup("interlock.prod")) ? (
                <>
                  <ButtonGroup>
                    <Button type="button" color="primary" onClick={()=>{
                        setworkorderInterlockOnForm({});
                      }}>
                      <i className="uil uil-padlock me-2"></i>{`Batch${t("@COL_INTERLOCK_SETTING")}`}  {/*Batch인터락 설정*/}
                    </Button>
                    <Button type="button" color="secondary" onClick={()=>{
                        setworkorderInterlockOffForm({});
                      }}>
                      {t("@COL_RELEASE")} {/*해제*/}
                    </Button>                    
                  </ButtonGroup>
                </>
              ) : null
            }
            {
              checkUsergroup("interlock.oper") ? (
                <>
                  <ButtonGroup>
                    <Button type="button" color="info" onClick={()=>{
                      const rows = gridRef.current!.api.getSelectedRows();
                      if(rows.length <= 0)
                      {
                        alertBox(t("@MSG_PLEASE_SELECT_BATCH"));  //Batch를 선택해 주세요.
                        return;
                      }

                      for(const row of rows){
                        // if(row.prodType != 'M'){
                        //   alertBox(t("@MSG_ONLY_MASSPRODUCTIONMODEL_PROCESSED"));  //양산 모델만 처리 가능합니다.
                        //   return;
                        // }       
                      }

                      if(!processHandleEditRef.current.setList(rows))
                        return;

                      setProcessHandleForm({});
                      }}>
                      <i className="uil uil-lock-open-alt me-2"></i>{t("@ACTION_REGISTER")} {/*조치등록*/}
                    </Button>
                  </ButtonGroup>
                </>
              ) : null
            }            
            {
              checkUsergroup("administrators") ? (
                <>
                  <ButtonGroup>
                    <Button type="button" color="warning" onClick={processDeleteHandler}>
                      <i className="uil uil-history me-2"></i>{t("@ACTION_RESET")} {/*조치리셋*/}
                    </Button>
                    <Button type="button" color="light" onClick={deleteHandler}>
                      <i className="uil uil-times me-2"></i>{t("@DELETE")}  {/*삭제*/}
                    </Button>
                  </ButtonGroup>
                </>
              ) : null
            }
          </div>
        }
        search={
          <SearchBase 
            ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>            
              </>
            }
          >
            <Row>
              <Col style={{ maxWidth: "120px" }}>
                <select name="fromToDtType" className="form-select" required={true}>
                  <option value="I">{t("@INTERLOCK_TIME")}</option> {/* 인터락시간 */}
                  <option value="4">{t("@4MSCAN_TIME")}</option> {/* 4M스캔시간 */}
                </select>
              </Col>
              <Col style={{ maxWidth: "120px" }}>
                <DateTimePicker ref={fromDateRef} name="fromDt" defaultValue={moment().add(-3, 'days').toDate()}  placeholderText= {t("@SEARCH_START_DATE")} 
                  dateFormat="yyyy-MM-dd" required={true} /> {/* 조회시작 */}
              </Col>
              <Col style={{ maxWidth: "120px" }}>
                <DateTimePicker name="toDt" ref={toDateRef} placeholderText={t("@SEARCH_END_DATE")} dateFormat="yyyy-MM-dd" required={true} /> {/* 조회종료 */}
              </Col>
              <Col>
                <AutoCombo name="fdcType" placeholder={t("@COL_DIVISION")} mapCode="code" category="FDC_DEFECT_TYPE" /> {/* 구분 */}
              </Col>
              <Col>
                <AutoCombo name="operType" placeholder={t("@COL_OPERATION_DIVISION")} mapCode="code" category="FDC_OPER_TYPE" /> {/* 공정구분 */}
              </Col>
              {/* <Col style={{ maxWidth: "80px" }}>
                <select name="autoYn" className="form-select">
                  <option value="">자동</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col> */}
              <Col style={{ maxWidth: "110px" }}>
                <select name="processStep" className="form-select">
                  <option value="">{t("@STATE")}</option> {/* 상태 */}
                  <option value="H">{t("@ITEMLIST_PROCESS_REGISTER")}</option> {/* 처리등록 */}
                  <option value="S">{t("@ITEMLIST_AGREEMENT_COMPLETED")}</option> {/* 합의완료 */}
                </select>
              </Col>
              <Col>
                <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} mapCode="model" /> {/* 모델코드 */}
              </Col>
              <Col>
                <AutoCombo name="eqpCode" sx={{ minWidth: "130px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" /> {/* 설비코드 */}
              </Col>
              <Col>
                <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 130 }} className="form-control" placeholder="LOT(WORKORDER)" />  
              </Col>
            </Row>
          </SearchBase>
        }
      >
        <Row style={{ height: "100%" }}>
          <Col id="grid-left-container">
            <Row style={{ height: "100%" }}>
              <Col md={9}>
                <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={gridRef}
                    columnDefs={fdcInterlockDefs({ 
                      handleHandler: async (row: Dictionary) => {
                        setProcessHandleForm(row);
                      },
                      settleHandler: async (row: Dictionary) => {
                        setProcessSettleForm(row);
                      },
                    })}
                    rowSelection={'multiple'}
                    onRowSelected={rowSelectedHandler}
                    onSelectionChanged={selectionChangedHandler}
                    suppressRowClickSelection={true}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}             
                    onGridReady={() => {
                      setList([]);
                    }}                           
                    rowClassRules={{
                      'handle-row': (param: RowClassParams) => { 
                        return !!param.data.handleDt && !param.data.settleDt;
                      },
                      // 'spl-row': (param: RowClassParams) => { 
                      //   return param.data.prodType != 'M';
                      // },
                      'settle-row': (param: RowClassParams) => { 
                        return !!param.data.handleDt && !!param.data.settleDt;
                      },
                    }}
                />                                  
                </div>              
              </Col>
              <Col md={3}>
                <div style={{ height: "100%" }}>
                  <Row className="pb-2" style={{ height: "100%" }}>
                    <Col style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <Row style={{ flexGrow: 1 }} className="pb-1">
                        <Col>
                          <GridBase
                            ref={panelGridRef}
                            rowSelection={'multiple'}
                            columnDefs={getPanelRef()}
                            rowMultiSelectWithClick={false}
                            tooltipShowDelay={0}
                            tooltipHideDelay={1000}
                            onGridReady={() => {
                              setPanelList([]);
                            }}
                          />
                        </Col>
                      </Row>
                      <Row style={{ height: "35px" }}>
                        <Col className="d-flex gap-2 justify-content-end">
                          {
                            (checkUsergroup("interlock.oper") || checkUsergroup("interlock.prod")) ? (
                              <>
                                <ButtonGroup>
                                  <Button type="button" color="primary" onClick={() => { panelRealtimeInterlockHandler('Y') }}>
                                    <i className="uil uil-padlock me-2"></i>{t("@SELECTPANNEL_INTERLOCK_SETTING")} {/*선택판넬 인터락 설정*/}
                                  </Button>
                                  <Button type="button" color="secondary" onClick={() => { panelRealtimeInterlockHandler('N') }}>
                                    {t("@COL_RELEASE")}  {/*선택판넬 인터락 설정*/}
                                  </Button>   
                                </ButtonGroup>
                              </>
                            ) : null
                          }
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>          
        </Row>
      </ListBase>

      <FdcHandleEdit
        ref={processHandleEditRef}
        onComplete={() => {
          searchHandler();
          processHandleEditRef.current.setShowModal(false);
        }}
      />

      <FdcSettleEdit
        ref={processSettleEditRef}
        onComplete={() => {
          searchHandler();
          processSettleEditRef.current.setShowModal(false);
        }}
      />

{/* 


      <ProcessSettleEdit
        ref={processSettleEditRef}
        onComplete={() => {
          searchHandler();
          processSettleEditRef.current.setShowModal(false);
        }}
      />

      <ProcessDenyEdit
        ref={processDenyEditRef}
        onComplete={() => {
          searchHandler();
          processDenyEditRef.current.setShowModal(false);
        }}
      /> */}

      <WorkorderInterlockOn
        ref={workorderInterlockOnRef}
        onComplete={() => {
          //searchHandler();
          workorderInterlockOnRef.current.setShowModal(false);
        }}
      />

      <WorkorderInterlockOff
        ref={workorderInterlockOffRef}
        onComplete={() => {
          //searchHandler();
          workorderInterlockOffRef.current.setShowModal(false);
        }}
      />

      <ParamChart
        ref={paramChartRef}
        initHandler={() => {}}
      />

      <ParamChartEx
        ref={paramChartRefEx}
        initHandler={() => {}}
      />

      <RecipeChart
        ref={recipeChartRef}
        initHandler={() => {}}
      />

      <RecipeChartEx
        ref={recipeChartRefEx}
        initHandler={() => {}}
      />
    </>
  );
};

export default FdcInterlockList;
