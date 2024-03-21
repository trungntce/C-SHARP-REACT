import { CellDoubleClickedEvent, FirstDataRenderedEvent, GetRowIdFunc, GetRowIdParams, RowClassParams, RowHeightParams, RowSelectedEvent, SelectionChangedEvent } from "ag-grid-community";
import moment from "moment";
import { useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
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
import { qtimeDefs, spcDefs, paramDefs, recipeDefs, interlockMasterDefs, defectDefs, reworkDefs } from "./PanelInterlockDefs";
import { downloadFile, executeIdle, listToCamelCase, merge, showLoading, yyyymmddhhmmss } from "../../../common/utility";
import style from "./PanelInterlock.module.scss";
import api from "../../../common/api";
import ProcessJudgeEdit from "./ProcessJudgeEdit";
import InterlockEdit from "./InterlockEdit";
import InterlockOffEdit from "./InterlockOffEdit";
import ProcessSettleEdit from "./ProcessSettleEdit";
import ProcessDenyEdit from "./ProcessDenyEdit";
import { checkUsergroup, parseUsergroup } from "../../../common/permission";
import { panelDefs } from "../../Trace/PanelDefs";
import { traceDefs } from "../../Trace/TraceDefs";
import WorkorderInterlockOn from "./WorkorderInterlockOn";
import WorkorderInterlockOff from "./WorkorderInterlockOff";
import { showProgress } from "../../../components/MessageBox/Progress";
import { useTranslation } from "react-i18next";
import IssueEdit from "./IssueEdit";

export const detectStep = (row: Dictionary) => {
  if( // 1차 합의가 완료된 경우
    row.judgeCodeFirst && row.settleCodeFirst && 
    row.judgeCodeFirst == row.settleCodeFirst
  )
    return [1, 'COMPLETE'];

  if( // 2차 합의가 완료된 경우
    row.judgeCodeSecond && row.settleCodeSecond && 
    row.judgeCodeSecond == row.settleCodeSecond
  )
    return [2, 'COMPLETE'];

  if(row.judgeCodeSecond) // 2차 판정 완료
    return [2, 'JUDGE'];

  if(row.settleCodeFirst) // 1차 합의 실패
    return [1, 'SETTLE'];

  if(row.judgeCodeFirst) // 1차 판정 완료
    return [1, 'JUDGE'];

  return [0, ''];
}


//SIFLEX 자체 수정이력 있음
const PanelInterlockList = () => {
  const { t } = useTranslation();
  const paramChartRef = useRef<any>();
  const recipeChartRef = useRef<any>();

  const paramChartRefEx = useRef<any>();
  const recipeChartRefEx = useRef<any>();

  const panelInterlockEditRef = useRef<any>();
  const panelInterlockOffEditRef = useRef<any>();
  const [processJudgeEditRef, setProcessJudgeForm, closeProcessJudgeModal] = useEditRef();
  const [processSettleEditRef, setProcessSettleForm, closeProcessSettleModal] = useEditRef();
  const [processDenyEditRef, setProcessDenyForm, closeProcessDenyModal] = useEditRef();

  const [issueEditRef, setIssueForm, closeIssueModal] = useEditRef();

  const [workorderInterlockOnRef, setworkorderInterlockOnForm, closeworkorderInterlockOnModal] = useEditRef();
  const [workorderInterlockOffRef, setworkorderInterlockOffForm, closeworkorderInterlockOffModal] = useEditRef();

  const lotNoRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();
  const [panelGridRef, setPanelList] = useGridRef();
  const [fromGridRef, setFromList] = useGridRef();
  const [toGridRef, setToList] = useGridRef();
  const fromDateRef = useRef<any>();
  const toDateRef = useRef<any>();
  const interlockCodeMajorRef = useRef<any>();

  const { refetch } = useApi("panelinterlock/union", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const search = getSearch();

    const fromDt = moment.utc(search["fromDt"]);
    const toDt = moment.utc(search["toDt"]);

    const duration = moment.duration(toDt.diff(fromDt));
    const days = duration.asDays();

    if (days > 89) {
      alertBox(t("@MSG_SELECT_MAX_DAY_90")); //조회기간은 최대 90일입니다.
      return;
    }

    const result = await refetch();
    if (result.data) {

      gridRef.current!.api.deselectAll();

      setList(result.data);
      setPanelList([]);
      //setFromList([]);
      setToList([]);
    }
  };

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    let rows = e.api.getSelectedRows();

    if (e.node.isSelected() && rows.length > 1) {
      const prevRows = rows.filter(x => x.rowNo != e.data.rowNo);
      const first = prevRows[0];
  
      if (JSON.stringify(detectStep(first)) != JSON.stringify(detectStep(e.data))) {
        alertBox(t("@MSG_SAME_PROGRESS_PANEL_POSSIBLE")); //같은 진행상태의 판넬들만 일괄처리가 가능합니다. 
        e.node.setSelected(false);
        return;
      }
  
      if (first.operSeqNo != e.data.operSeqNo ||
        first.operCode != e.data.operCode ||
        first.gubun != e.data.gubun) {
        alertBox(t("@MSG_ALRAM_TYPE3")); //같은 공순, 공정, 구분(관리,스팩)만 일괄처리가 가능합니다.
        e.node.setSelected(false);
        return;
      }
    }

    bindPanelList();
  }

  const bindPanelList = async () => {
    const rows = gridRef.current!.api.getSelectedRows();

    showLoading(gridRef, true);
    showLoading(panelGridRef, true);

    let merged: Dictionary[] = [];

    for (let i = 0; i < rows.length; i++) {
      const x: Dictionary = rows[i];

      if(x.panelCnt <= 0){
        x.panelJson = '[]';
        continue;
      }

      if(!x.panelJson){
        if(!x.headerGroupKey)
          continue;

        const result = await api<any>("get", "panelinterlock/panel", { headerGroupKey: x.headerGroupKey});

        if(result.data?.length){
          merged = merged.concat(listToCamelCase(result.data));
        }

        const rowNode = gridRef.current!.api.getRowNode(x.rowNo);
        if(rowNode)
          rowNode.setDataValue('panelJson', JSON.stringify(result.data));
      }
      else{
        const panelList = JSON.parse(x.panelJson);
        if (panelList?.length) {
          merged = merged.concat(listToCamelCase(panelList));
        }
      }
    }

    window.setTimeout(() => {
      setPanelList(merged);
      showLoading(gridRef, false);
    }, 100);
  }

  const getRowId = useMemo<GetRowIdFunc>(() => {
    return (params: GetRowIdParams) => {
      return params.data.rowNo;
    };
  }, []);

  const processDeleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if (rows.length <= 0) {
      alertBox(t("@MSG_PLEASE_SELECT_ITEM")); //항목을 선택해 주세요.
      return;
    }

    const param: Dictionary = {};
    param.json = JSON.stringify(rows);

    confirmBox(t("@MSG_ASK_TYPE5"), async () => { //판정 정보만 리셋되며 재처리, 폐기 된 데이터는 별도로 처리해야합니다. 리셋한 자료된 복구가 불가능합니다. 그래도 리셋 하시겠습니까?
      showLoading(gridRef, true);
      const result = await api<any>("post", "panelinterlock/processdeletejson", param);
      if (result.data && result.data <= 0) {
        alertBox(t("@MSG_ERROR_TYPE1")); //리셋 중 오류가 발생했습니다.
        showLoading(gridRef, false);
        return;
      }

      alertBox(t("@MSG_COMPLETED")); //완료되었습니다.
      showLoading(gridRef, false);

      searchHandler();
    }, async () => {
    })
  };

  const panelRealtimeInterlockHandler = async (interlockYn: string) => {
    const rows = panelGridRef.current!.api.getSelectedRows();

    if (rows.length <= 0) {
      alertBox(t("@MSG_PLEASE_SELECT_PANEL")); //판넬을 선택해 주세요.
      return;
    }

    const param: Dictionary = {};
    param.interlockYn = interlockYn;
    param.json = JSON.stringify(rows);

    confirmBox(interlockYn == 'Y' ? t("@MSG_ASK_TYPE6") : t("@MSG_ASK_TYPE7"), async () => {  //판넬에 대한 인터락을 설정하시겠습니까? : 판넬에 대한 인터락을 해제하시겠습니까?
      const result = await api<any>("post", "panelinterlock/realtime", param);
      if (result.data && result.data <= 0) {
        alertBox(t("@MSG_ERROR_TYPE2")); //설정 중 오류가 발생했습니다.
        return;
      }

      updatePanelInterlock(rows, interlockYn);

      alertBox(t("@MSG_COMPLETED")); //완료되었습니다.

      bindPanelList();
    }, async () => {
    })
  }

  const updatePanelInterlock = (panelRows: Dictionary[], interlockYn: string) => {
    const rows = gridRef.current!.api.getSelectedRows();

    rows.forEach((x: Dictionary) => {
      const panelList = JSON.parse(x.panelJson);
      const findList = panelList.filter((x: Dictionary) => panelRows.find(y => y.panelId == x["panel_id"]));
      findList.forEach((x: Dictionary) => x["interlock_yn"] = interlockYn);

      x.panelJson = JSON.stringify(panelList);
    });
  }

  const deleteHandler = async () => {
    const rows = gridRef.current!.api.getSelectedRows();
    if (rows.length <= 0) {
      alertBox(t("@MSG_PLEASE_SELECT_PANEL"));//판넬을 선택해 주세요.
      return;
    }

    const param: Dictionary = {};
    param.json = JSON.stringify(rows);

    confirmBox(t("@MSG_DELETED_NO_RESTORE"), async () => { //삭제한 자료는 복구가 불가능합니다. 그래도 삭제하시겠습니까?
      showLoading(gridRef, true);
      const result = await api<any>("post", "panelinterlock/deletejson", param);
      if (result.data && result.data <= 0) {
        alertBox(t("@MSG_ERROR_TYPE3")); //삭제 중 오류가 발생했습니다.
        showLoading(gridRef, false);
        return;
      }

      alertBox(t("@MSG_COMPLETED")); //완료되었습니다.
      showLoading(gridRef, false);

      searchHandler();
    }, async () => {
    });
  }

  const getPanelRef = () => {
    const panel = panelDefs().filter(x => x.headerClass != "multi4m" || x.checkboxSelection);

    return panel;
  }

  const excelHandler = async (e: any) => {
    e.preventDefault();

    if (gridRef.current!.api.getDisplayedRowCount() <= 0) {
      alertBox(t("@MSG_ALRAM_TYPE4")); //데이터가 없습니다.
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "panelinterlock/union", param);
    downloadFile(`이상발생_List_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

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
    interlockCodeMajorRef.current.setSelect(category);
      
    executeIdle(() => {
      searchHandler();
    });
  }

  useEffect(() => {
    searchParamHandler();
  }, []);

  return (
    <>
      <ListBase
        className={style.interlockWrap}
        centerCol={1}
        endCol={8}
        leftButtons={
          <div className="d-flex gap-2 justify-content-start">
            {
              (checkUsergroup("interlock.oper") || checkUsergroup("interlock.prod") || checkUsergroup("interlock.qual")) ? (
                <>
                  <ButtonGroup>
                    <Button type="button" color="primary" onClick={()=>{
                      const rows = gridRef.current!.api.getSelectedRows();
                      if(rows.length <= 0)
                      {
                        alertBox(t("@MSG_PLEASE_SELECT_PANEL")); //판넬을 선택해 주세요.
                        return;
                      }

                      if(!processSettleEditRef.current.setList(rows))
                        return;

                      const row = rows[0];
                      const step = detectStep(rows[0]);

                      setProcessSettleForm({ 
                        settleUser: localStorage.getItem("user-id")?.toString(),
                        settleCode: step[0] == 1 ? row.judgeCodeFirst : row.judgeCodeSecond,
                        });
                      }}>
                      <i className="uil uil-pen me-2"></i>{t("@COL_ITEM_CONSULTATION")}  {/* 선택항목협의 */}
                    </Button>
                    <Button type="button" color="secondary" onClick={()=>{
                      const rows = gridRef.current!.api.getSelectedRows();
                      if(rows.length <= 0)
                      {
                        alertBox(t("@MSG_PLEASE_SELECT_PANEL")); //판넬을 선택해 주세요.
                        return;
                      }

                      if(rows.find(x => x.gubun == "C-NG")){
                        alertBox(t("@MSG_ALRAM_TYPE5")); //관리선 NG는 합의만 가능합니다.
                        return;
                      }

                      if(!processDenyEditRef.current.setList(rows))
                        return;

                      setProcessDenyForm({
                        settleUser: localStorage.getItem("user-id")?.toString()
                      });
                      }}>
                      <i className="uil uil-times-square me-2"></i>{t("@COMPANION")}  {/* 반려 */}
                    </Button>
                  </ButtonGroup>
                </>
              ) : null
            }
            {
              (checkUsergroup("interlock.trust")) ? (
                <>
                  <ButtonGroup>
                    <Button type="button" color="dark" onClick={()=>{
                      const rows = gridRef.current!.api.getSelectedRows();
                      if(rows.length <= 0)
                      {
                        alertBox(t("@MSG_PLEASE_SELECT_PANEL")); //판넬을 선택해 주세요.
                        return;
                      }

                      if(!issueEditRef.current.setList(rows))
                        return;

                        setIssueForm({
                          issueUser: localStorage.getItem("user-id")?.toString(),
                        });
                      }}>
                      <i className="uil uil-pen me-2"></i>{t("@SYSTEM_ISSUE")} {t("@REGIST")}  {/* 이슈등록 */}
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
              (checkUsergroup("interlock.oper") || checkUsergroup("interlock.prod") || checkUsergroup("interlock.qual")) ? (
                <>
                  <ButtonGroup>
                    <Button type="button" color="primary" onClick={()=>{
                        setworkorderInterlockOnForm({});
                      }}>
                      <i className="uil uil-padlock me-2"></i>Batch{t("@COL_INTERLOCK_SETTING")}  {/* Batch인터락 설정 */}
                    </Button>
                    <Button type="button" color="secondary" onClick={()=>{
                        setworkorderInterlockOffForm({});
                      }}>
                      {t("@COL_RELEASE")}  {/* 해제 */}
                    </Button>                    
                  </ButtonGroup>
                </>
              ) : null
            }
            {
              (checkUsergroup("interlock.oper") || checkUsergroup("interlock.prod")) ? (
                <>
                  {/* <Button type="button" color="primary" onClick={()=>{
                      panelInterlockEditRef.current.setShowModal(true);
                    }}>
                    <i className="uil uil-pen me-2"></i>수기등록
                  </Button> */}
                  <ButtonGroup>
                    <Button type="button" color="secondary" onClick={()=>{
                      const rows = gridRef.current!.api.getSelectedRows();
                      if(rows.length <= 0)
                      {
                        alertBox(t("@MSG_PLEASE_SELECT_PANEL")); //판넬을 선택해 주세요.
                        return;
                      }

                      if(rows.find(x => x.gubun == "C-NG")){
                        alertBox(t("@MSG_ALRAM_TYPE6"));  //관리선 NG는 양품화면 가능합니다.
                        return;
                      }

                      if(!processJudgeEditRef.current.setList(rows, 'D'))
                        return;

                      setProcessJudgeForm({ 
                        judgeUser: localStorage.getItem("user-id")?.toString(),
                        judgeCode: 'D' 
                      });
                      }}>
                      <i className="uil uil-trash me-2"></i>{t("@COL_DISPOSAL_JUDGMENT")}  {/* 폐기판정 */}
                    </Button>
                    <Button type="button" color="success" onClick={()=>{
                      const rows = gridRef.current!.api.getSelectedRows();
                      if(rows.length <= 0)
                      {
                        alertBox(t("@MSG_PLEASE_SELECT_PANEL")); //판넬을 선택해 주세요.
                        return;
                      }

                      if(rows.find(x => x.gubun == "C-NG")){
                        alertBox(t("@MSG_ALRAM_TYPE6")); //관리선 NG는 양품화면 가능합니다.
                        return;
                      }

                      if(!processJudgeEditRef.current.setList(rows, 'R'))
                        return;

                      setProcessJudgeForm({ 
                        judgeUser: localStorage.getItem("user-id")?.toString(),
                        judgeCode: 'R' 
                      });
                      }}>
                      <i className="uil uil-ambulance me-2"></i>{t("@COL_REWORK_JUDGMENT")}  {/* 재처리판정 */}
                    </Button>
                    <Button type="button" color="info" onClick={()=>{
                      const rows = gridRef.current!.api.getSelectedRows();
                      if(rows.length <= 0)
                      {
                        alertBox(t("@MSG_PLEASE_SELECT_PANEL")); //판넬을 선택해 주세요.
                        return;
                      }

                      if(!processJudgeEditRef.current.setList(rows, 'U'))
                        return;

                      setProcessJudgeForm({ 
                        judgeUser: localStorage.getItem("user-id")?.toString(),
                        judgeCode: 'U' 
                      });
                      }}>
                       <i className="uil uil-lock-open-alt me-2"></i>{t("@COL_GOOD_QUALITY")} {/* 양품화 */}
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
                      <i className="uil uil-history me-2"></i>{t("@COL_JUDGMENT_RESET")} {/* 판정리셋 */}
                    </Button>
                    <Button type="button" color="light" onClick={deleteHandler}>
                      <i className="uil uil-times me-2"></i>{t("@DELETE")} {/* 삭제 */}
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
                  <option value="I">{t("@INTERLOCK_TIME")}</option>           {/* 인터락시간 */}
                  <option value="P">{`PNL${t("@COL_SCAN_TIME")}`}</option>    {/* PNL스캔시간 */}
                </select>
              </Col>
              <Col style={{ maxWidth: "120px" }}>
                <DateTimePicker ref={fromDateRef}  name="fromDt" defaultValue={moment().add(-3, 'days').toDate()}  placeholderText="조회시작" 
                  dateFormat="yyyy-MM-dd" required={true} />
              </Col>
              <Col style={{ maxWidth: "120px" }}>
                <DateTimePicker name="toDt" ref={toDateRef} placeholderText="조회종료" dateFormat="yyyy-MM-dd" required={true} />
              </Col>
              <Col style={{ maxWidth: "100px" }}>
                <select name="processStatus" className="form-select">
                  <option value="">{t("@TOTAL")}</option>
                  <option value="P">{t("@INCOMPLETE")}</option>
                  <option value="C">{t("@COMPLETE")}</option>
                </select>
              </Col>
              <Col>
                <AutoCombo name="interlockCodeMajor" ref={interlockCodeMajorRef} placeholder={t("@LARGE_CATEGORY")} mapCode="code" category="INTERLOCK_MAJOR" isLang={true} />  {/* 대분류 */}
              </Col>
              <Col>
                <AutoCombo name="interlockCode" placeholder={t("@SUBCLASS")} mapCode="code" category="HOLDINGREASON" isLang={true} />  {/* 소분류 */}
              </Col>
              {/* <Col style={{ maxWidth: "80px" }}>
                <select name="autoYn" className="form-select">
                  <option value="">자동</option>
                  <option value="Y">Y</option>
                  <option value="N">N</option>
                </select>
              </Col> */}
              <Col style={{ maxWidth: "110px" }}>
                <select name="judgeCodeFirst" className="form-select">
                  <option value="">{t("@FIRST_JUDGMENT")}</option>      {/* 1차판정 */}  
                  <option value="D">{t("@COL_DISPOSAL")}</option>       {/* 폐기 */}
                  <option value="R">{t("@COL_REWORK")}</option>         {/* 재처리 */}
                  <option value="U">{t("@COL_GOOD_QUALITY")}</option>   {/* 양품홤 */}
                </select>
              </Col>
              <Col style={{ maxWidth: "110px" }}>
                <select name="judgeCodeSecond" className="form-select">
                  <option value="">{t("@SECOND_JUDGMNET")}</option>     {/* 2차판정 */}  
                  <option value="D">{t("@COL_DISPOSAL")}</option>       {/* 폐기 */}  
                  <option value="R">{t("@COL_REWORK")}</option>         {/* 재처리 */}  
                  <option value="U">{t("@COL_GOOD_QUALITY")}</option>   {/* 양품화 */}  
                </select>
              </Col>
              <Col>
                <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} mapCode="model" />  {/* 모델코드 */}
              </Col>
              <Col>
                <AutoCombo name="operCode" sx={{ minWidth: "90px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="oper" />  {/* 공정코드 */}
              </Col>
              <Col>
                <AutoCombo name="eqpCode" sx={{ minWidth: "110px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />  {/* 설비코드 */}
              </Col>
              <Col>
                <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 110 }} className="form-control" placeholder="LOT(WORKORDER)" />  
              </Col>
              {/* <Col style={{ maxWidth: 180 }}>
                <Button type="button" color="info" style={{ width: 110 }} onClick={() => {
                  lotSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  LOT 검색
                </Button>
              </Col> */}
              {/* <Col style={{ minWidth: "130px" }}>
                <Input innerRef={panelIdRef} name="panelId" type="text" className="form-control" placeholder="판넬바코드" />
              </Col> */}
              {/* <Col style={{ maxWidth: 180 }}>
                <Button type="button" color="success" style={{ width: 150 }} onClick={() => {
                  panelSearchRef.current.setShowModal(true);
                }}>
                  <i className="fa fa-fw fa-search"></i>{" "}
                  판넬 바코드 검색
                </Button>
              </Col> */}
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
                    className="ag-grid-groupheader-center"
                    columnDefs={interlockMasterDefs({ 
                      judgeFirstHandler: async (row: Dictionary) => {
                        const result = await api<Dictionary[]>("get", "panelinterlock/processex", { groupKey: row.groupKey });
                        if(result.data?.length){
                          processJudgeEditRef.current.setList([]);
                          setProcessJudgeForm(result.data[0]);
                        }
                      },
                      settleFirstHandler: async (row: Dictionary) => {
                        const result = await api<Dictionary[]>("get", "panelinterlock/processex", { groupKey: row.groupKey });
                        if(result.data?.length){
                          processSettleEditRef.current.setList([]);
                          setProcessSettleForm(result.data[0]);
                        }
                      },
                      denyFirstHandler: async (row: Dictionary) => {
                        const result = await api<Dictionary[]>("get", "panelinterlock/processex", { groupKey: row.groupKey });
                        if(result.data?.length){
                          processDenyEditRef.current.setList([]);
                          setProcessDenyForm(result.data[0]);
                        }
                      },                      
                      judgeSecondHandler: async (row: Dictionary) => {
                        const result = await api<Dictionary[]>("get", "panelinterlock/processex", { groupKey: row.groupKey });
                        if(result.data?.length){
                          processJudgeEditRef.current.setList([]);
                          setProcessJudgeForm(result.data[1]);
                        }
                      },
                      settleSecondHandler: async (row: Dictionary) => {
                        const result = await api<Dictionary[]>("get", "panelinterlock/processex", { groupKey: row.groupKey });
                        if(result.data?.length){
                          processSettleEditRef.current.setList([]);
                          setProcessSettleForm(result.data[1]);
                        }
                      },
                      issueHandler: async (row: Dictionary) => {
                        issueEditRef.current.setList([]);
                        setIssueForm(row);
                      },
                      fromSearchHandler: (row: Dictionary) => {
                        console.log(row);
                        // showLoading(fromGridRef, true);
                        // api<Dictionary[]>("get", "panelinterlock/from", { interlockCode: row.interlockCode, itemKey: row.itemKey }).then(result => {
                        //   if(result.data.length){
                        //     switch(row.interlockCode){
                        //       case "5001":
                        //         fromGridRef.current!.api.setColumnDefs(paramDefs());
                        //         break;
                        //       case "5002":
                        //         fromGridRef.current!.api.setColumnDefs(recipeDefs());
                        //         break;
                        //       case "5003":
                        //         fromGridRef.current!.api.setColumnDefs(spcDefs());
                        //         break;
                        //       case "5007":
                        //         fromGridRef.current!.api.setColumnDefs(qtimeDefs());
                        //         break;
                        //       }
                          
                        //     setFromList(result.data);
                        //   }
                        // });
                      },
                      toSearchHandler: async (row: Dictionary, step: number) => {
                        showLoading(toGridRef, true);

                        const groupKey = row.groupKey;
                        const settleCode = row.settleCodeSecond || row.settleCodeFirst;

                        switch(settleCode){
                          case "D":
                            {
                              toGridRef.current!.api.setColumnDefs(defectDefs());

                              const result = await api<Dictionary[]>("get", "panelinterlock/defect", { groupKey: groupKey });
                              if(result.data?.length){
                                setToList(result.data);
                              }

                              break;
                            }
                          case "R":
                            {
                              toGridRef.current!.api.setColumnDefs(reworkDefs());

                              const result = await api<Dictionary[]>("get", "panelinterlock/rework", { groupKey: groupKey });
                              if(result.data?.length){
                                setToList(result.data);
                              }
                              
                              break;
                            }
                          }
                      },
                    })}
                    rowSelection={'multiple'}
                    onRowSelected={rowSelectedHandler}
                    suppressRowClickSelection={true}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                    onGridReady={() => {
                      setList([]);
                    }}
                    rowClassRules={{
                      'ungrouped-row': (param: RowClassParams) => { 
                        return !param.data.groupKey;
                      },
                      'grouped-row': (param: RowClassParams) => { 
                        return !!param.data.groupKey;
                      },
                    }}
                    getRowId={getRowId}
                />                                  
                </div>              
              </Col>
              <Col md={3}>
                <div style={{ height: "100%" }}>
                  <Row className="pb-2" style={{ height: "70%" }}>
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
                            (checkUsergroup("interlock.oper") || checkUsergroup("interlock.prod") || checkUsergroup("interlock.qual")) ? (
                              <>
                                <ButtonGroup>
                                  <Button type="button" color="primary" onClick={() => { panelRealtimeInterlockHandler('Y') }}>
                                    <i className="uil uil-padlock me-2"></i>{`${t("@SELECTPANNEL")}${t("@COL_INTERLOCK_SETTING")}`}  {/* 선택판넬 인터락 설정 */}
                                  </Button>
                                  <Button type="button" color="secondary" onClick={() => { panelRealtimeInterlockHandler('N') }}>  {/* 해제 */}
                                    {t("@COL_RELEASE")}
                                  </Button>   
                                </ButtonGroup>
                              </>
                            ) : null
                          }
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  {/* <Row className="pb-2" style={{ height: "30%" }}>
                    <Col>
                      <GridBase
                        ref={fromGridRef}
                        columnDefs={paramDefs()}
                        tooltipShowDelay={0}
                        tooltipHideDelay={1000}                    
                        onGridReady={() => {
                          setFromList([]);
                        }}
                      />
                    </Col>
                  </Row> */}
                  <Row className="pb-2" style={{ height: "30%" }}>
                    <Col>
                      <GridBase
                        ref={toGridRef}
                        columnDefs={defectDefs()}
                        rowMultiSelectWithClick={false}
                        tooltipShowDelay={0}
                        tooltipHideDelay={1000}                            
                        onGridReady={() => {
                          setToList([]);
                        }}
                      />
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Col>          
        </Row>
      </ListBase>

      <InterlockEdit
        ref={panelInterlockEditRef}
        onComplete={() => {
          searchHandler();
          panelInterlockEditRef.current.setShowModal(false);
        }}
      />

      <InterlockOffEdit
        ref={panelInterlockOffEditRef}
        onComplete={() => {
          searchHandler();
          panelInterlockOffEditRef.current.setShowModal(false);
        }}
      />

      <ProcessJudgeEdit
        ref={processJudgeEditRef}
        onComplete={() => {
          searchHandler();
          processJudgeEditRef.current.setShowModal(false);
        }}
      />

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
      />

      <IssueEdit
        ref={issueEditRef}
        onComplete={() => {
          searchHandler();
          closeIssueModal();
        }}
      />

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

export default PanelInterlockList;
