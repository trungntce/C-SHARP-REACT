import { GetRowIdFunc, GetRowIdParams, RowClassParams, RowSelectedEvent } from "ag-grid-community";
import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Input, Row } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary, contentType } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import AutoCombo from "../../../components/Common/AutoCombo";
import { alertBox } from "../../../components/MessageBox/Alert";
import { defectDefs } from "./PanelInterlockDefs";
import { downloadFile, executeIdle, listToCamelCase, merge, showLoading, yyyymmddhhmmss } from "../../../common/utility";
import style from "./PanelInterlock.module.scss";
import api from "../../../common/api";
import { panelDefs } from "../../Trace/PanelDefs";
import { showProgress } from "../../../components/MessageBox/Progress";
import { useTranslation } from "react-i18next";

const PanelInterlockReportList = () => {
  const { t } = useTranslation();
  const lotNoRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();
  const [panelGridRef, setPanelList] = useGridRef();
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
        button = {
          <>
          </>
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
                  <Row className="pb-2" style={{ height: "100%" }}>
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
                  </Row>
              </Col>
            </Row>
          </Col>          
        </Row>
      </ListBase>
    </>
  );
};

export default PanelInterlockReportList;