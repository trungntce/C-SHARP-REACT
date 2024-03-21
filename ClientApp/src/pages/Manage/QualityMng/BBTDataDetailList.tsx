import { CellClickedEvent, CellDoubleClickedEvent, RowSelectedEvent } from "ag-grid-community";
import { css, Global } from "@emotion/react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col, Input, Label, Row, Table } from "reactstrap";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../common/hooks";
import { contentType, Dictionary } from "../../../common/types";
import { downloadFile, easeOutQuad, executeIdle, isNullOrWhitespace, showLoading, toQueryString, yyyymmddhhmmss } from "../../../common/utility";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import { columnWorkorderDefs, columnDefs, columnPanelDefs, ngTypes } from "./BBTDataDetailDefs";
import { columnDetailDefs } from "./BBTAndDetailDefs";
import myStyle from "./BBTAndDetailList.module.scss";
import { alertBox } from "../../../components/MessageBox/Alert";
import { showProgress } from "../../../components/MessageBox/Progress";
import { currencyFormat, dateFormat, devideFormat, nullGuard, percentFormat } from "../../../common/utility";
import api from "../../../common/api";
import Select from "../../../components/Common/Select";

import { useTranslation } from "react-i18next";


const dataTableStyle = css`
  .ag-grid-bbtdata .ag-header.ag-header-allow-overflow .ag-header-row {
    overflow: hidden;
  }
  .ag-grid-bbtdata .ag-header-cell-sortable .ag-header-cell-label {
    justify-content: center;
  }

  .ag-grid-bbtdata .ag-header-group-cell-with-group {
    justify-content: center;
  }
  .ag-grid-bbtdata .cell-center {
    justify-content: center;
    text-align: center;
  }

  .ag-grid-bbtdata .cell-header-group-1 {
    padding-top: 20px;
    background: #ddd;
    z-index: 999;
  }

  .ag-grid-bbtdata .cell-header-group-2 {
    padding-top: 35px;
    background: #ddd;
  }
  .ag-grid-bbtdata .cell-header-group-3 {
    background: #ddd;
    font-size: 9px !important;
  }

  .ag-grid-bbtdata .cell-header-group-4 {
    background: #ddd;
  }

  .ag-grid-bbtdata .cell-header-group-5 {
    background: #ddd;
  }

  .ag-grid-bbtdata .ag-header-group-cell-no-group {
    background: #ddd;
    border-bottom: solid 1px #babfc7;
    border-left: solid 1px #babfc7;
  }
`;

const BBTDataDetailList = () => {
  const { t } = useTranslation();

  // const itemRef = useRef<string | null>(null);
  // const workorderRef = useRef<string | null>(null);
  // const panelIdRef = useRef<string | null>(null);
  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();
  const [workorderDetailRef, setWorkorderDetailList] = useGridRef();
  const [panelDetailGridRef, setPanelDetailList] = useGridRef();
  const [panelList, setPanelList] = useState<any | null>([]);
  const scanTime = useRef<any | null>(null);
  const eqpCode = useRef<string | null>(null);
  const rollId = useRef<string | null>(null);
  const workorder = useRef<string | null>(null);
  const panelId = useRef<string | null>(null)
  const mesDate = useRef<any | null>(null);
  const operCode = useRef<any | null>(null);
  const [detailRef, setDetailList] = useGridRef();
  const rowSpan = useRef<any>(0);

  const { refetch } = useApi("bbtdata", () => {
    const param = getSearch();
    param.pageNo = 1;
    param.pageSize = 999999;
    return param;
  }, gridRef);
  const { get } = useApi("bbtdata/byworkorder", () => { return {}; }, workorderDetailRef);
  // const { get : bbtdetail } = useApi("bbt/detail", () => { return {}; }, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if (result.data) {
      
      setWorkorderDetailList([]);

      setPanelDetailList([]);

      setList(result.data);

      const list: Dictionary[] = result.data;

      const topRow: Dictionary = {
        panelCnt: 0,
        totalCnt: 0,
        ngCnt: 0,
      }

      ngTypes.forEach(ng => {
        topRow[ng.field] = 0;
      });

      if(list.length){
        list.forEach((item) => {
          topRow.itemName = "Total";

          topRow.panelCnt += item.panelCnt;
          topRow.totalCnt += item.totalCnt;
          topRow.ngCnt += item.ngCnt

          ngTypes.forEach(ng => {
            topRow[ng.field] += item[ng.field];
          });
        });        

        gridRef.current!.api.setPinnedTopRowData([topRow]);
      }
    }
  };

  // useEffect(() => {
  //   searchHandler();
  // }, []);

  const cellClickHandler = async (event: CellClickedEvent<Dictionary>) => { 
    const bbtParam = getSearch();

    setWorkorderDetailList([]);

    setPanelDetailList([]);

    showLoading(workorderDetailRef, true);

    const params: Dictionary = {
      workorder: event.data!.workorder,
      fromDt: bbtParam.fromDt,
      toDt: bbtParam.toDt,
      eqpCode: event.data!.eqpCode,
      operCode: event.data!.operCode,
    };
    workorder.current = event.data!.workorder;
    eqpCode.current = event.data!.eqpCode;
    rollId.current = event.data!.rollId;
    panelId.current = event.data!.matchPanelId;
    //mesDate.current = event.data!.mesDate;
    const el = document.getElementById('workorderTitle');
    if (el && el !== undefined) { 
      el.innerText = event.data!.workorder + ' Batch Information';
    }
    
    const result = await get!(params);
    if (result.data) {
      setWorkorderDetailList(result.data);  
    }
  };

  const cellClickWorkorderHandler = async (event: CellClickedEvent<Dictionary>) => {

    setPanelDetailList([]);

    showLoading(panelDetailGridRef, true);

    panelId.current = event.data!.matchPanelId;
    operCode.current = event.data!.operCode;
    const elScanTime = document.getElementById('scanTimeTitle');
    const elEqpCode = document.getElementById('eqpCodeTitle');
    const elRollId = document.getElementById('rollIdTitle');
    const elPanelTitle = document.getElementById('panelTitle');

    if (elScanTime) {
      elScanTime.innerText = dateFormat(event.data!.scanTime, "YYYY-MM-DD HH:MM:SS");
    }
    if (elEqpCode) {
      elEqpCode.innerText = eqpCode?.current || '';
    }
    if (elRollId) { 
      elRollId.innerText = 'Roll ID ' + (rollId?.current || '');
    }
    if (elPanelTitle) { 
      elPanelTitle.innerText = event.data!.matchPanelId + ' Panel Information';
    }

    const bbtParam = getSearch();

    await api<any>("get", "bbtdata/bypanel", {
      panelId: event.data!.matchPanelId,
      fromDt: bbtParam.fromDt,
      toDt: bbtParam.toDt,
      workorder: event.data!.workorder,
      operCode: event.data!.operCode,
      eqpCode: event.data!.eqpCode,
    }).then((result) => {
      if (result.data) setPanelDetailList(result.data);
    });

    // const paramSearchDetail: Dictionary = {
    //   pageNo: 1,
    //   pageSize: 999999,
    //   fromDt: bbtParam.fromDt,
    //   toDt: bbtParam.toDt,
    //   type: bbtParam.type,
    //   workorder: event.data!.workorder,
    //   itemCode: event.data!.itemCode,
    //   modelCode: event.data!.modelCode,
    //   appCode: event.data!.appCode,
    //   panelId: event.data!.matchPanelId
    // };
    
    // showLoading(detailRef, true);
    // const resultDetail = await bbtdetail!(paramSearchDetail);
    // if (resultDetail.data) {
    //   setDetailList(resultDetail.data);
    // }
  };

  const excelHandler = async (e:any) => {
    e.preventDefault();

    if(gridRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox("데이터가 없습니다.");
      return;
    }

    const param = getSearch();
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "bbtdata", param);
    downloadFile(`bbt_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  const excelBatchHandler = async (e:any) => {
    e.preventDefault();

    if(isNullOrWhitespace(workorder.current) &&
      isNullOrWhitespace(panelId.current))
    {
      alertBox("고객코드나 BATCH을 선택해 주세요");
      return;
    }

    const bbtParam = getSearch();

    const param: Dictionary = {
      pageNo: 1,
      pageSize: 999999,
      fromDt: bbtParam.fromDt,
      toDt: bbtParam.toDt,
      type: bbtParam.type,
      workorder: workorder.current,
      panelId: panelId.current,
      eqpCode: eqpCode.current,
      isExcel: true
    };        

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "bbtdata/byworkorder", param);
    downloadFile(`bbt_excel_export_detail_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  const excelDetailHandler = async (e:any) => {
    e.preventDefault();

    if(isNullOrWhitespace(workorder.current) &&
      isNullOrWhitespace(panelId.current))
    {
      alertBox("고객코드나 BATCH을 선택해 주세요");
      return;
    }

    const bbtParam = getSearch();

    const param: Dictionary = {
      pageNo: 1,
      pageSize: 999999,
      fromDt: bbtParam.fromDt,
      toDt: bbtParam.toDt,
      type: bbtParam.type,
      workorder: workorder.current,
      panelId: panelId.current,
      operCode: operCode.current,
      isExcel: true
    };        

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "bbtdata/bypanel", param);
    downloadFile(`bbt_excel_export_detail_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  const getPanelRowData = (panelList?: any) => {
    if (null === panelList || panelList.length < 2) {
      return <></>;
    }
    const pieces = panelList[0];
    const opers = panelList[1];
    const len = opers.length < pieces.length ? pieces.length : opers.length;

    const panels = [];
    for (let i = 0; i < len; i++) {
      panels.push({
        row_id: i === 0 ? 'NO' : (pieces[i - 1]?.row_id ?? ''),
        judge_name: i === 0 ? '불량항목' : (pieces[i - 1]?.judge_name ?? ''),
        judge_cnt: i === 0 ? 'PNL DPU' : (pieces[i - 1]?.judge_cnt ?? ''),
        dpu_rate: i === 0 ? '항목별 불량 점유율' : (pieces[i - 1]?.dpu_rate ?? ''),
        oper_seq_no: opers[i]?.oper_seq_no ?? '',
        oper_description: opers[i]?.oper_description ?? '',
        eqp_description: opers[i]?.eqp_description ?? ''
      });
    }

    return panels.map((item: any, index: any) => { 
      return <tr key={index}>
        <td style={{ textAlign: 'center' }}>{ item.row_id }</td>
        <td style={{ textAlign: 'center' }}>{ item.judge_name }</td>
        <td style={{ textAlign: 'center' }}>{ item.judge_cnt }</td>
        <td style={{ textAlign: 'center' }}>{ item.dpu_rate }</td>
        <td style={{ textAlign: 'center' }}>{ item.oper_seq_no }</td>
        <td style={{ textAlign: 'center' }}>{ item.oper_description }</td>
        <td style={{ textAlign: 'center' }}>{ item.eqp_description }</td>
      </tr>
    });
  }

  return (
    <>
      {/* <Global styles={dataTableStyle} /> */}
      <ListBase
        className={myStyle.bbtContainer}
        folder="Quality Management"
        title="BBT"
        postfix="Quality Management"
        icon="menu"
        buttons={[]}
        search={
          <SearchBase ref={searchRef} 
            searchHandler={searchHandler}
            postButtons={
              <>
                <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i> Excel
                </Button>
              </>
            }>
            <div className="search-row">
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="fromDt" defaultValue={moment().add(-2, 'days').toDate()} placeholderText="조회시작" required={true} />
              </div>
              <div style={{ maxWidth: "115px" }}>
                <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
              </div>
              <div>
                <AutoCombo name="itemCode" parentname="inventoryItemId" sx={{ minWidth: "250px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item" />
              </div>
              <div>
                <Input name="itemName" placeholder={t("@NAME_PRODUCT")} style={{ minWidth: "250px" }} />
              </div>
              <div>
                <AutoCombo name="modelCode" sx={{ minWidth: "270px" }} placeholder={t("@MODEL_CODE")} mapCode="model" />
              </div>
              <div>
                <Input name="workorder" placeholder={t("@WORK_ORDER")} style={{ minWidth: "236px" }} />
              </div>
              <div>
                <AutoCombo name="eqpCode" sx={{ minWidth: "270px" }} placeholder={t("@EQP_CODE")} mapCode="eqp" />
              </div>
              <div>
                <AutoCombo name="appCode" sx={{ minWidth: "170px" }} placeholder={t("@APPLICATION")} mapCode="app" />
              </div>
              <div>
              <Select name="type" label={t("@CALC_STANDARD")} placeholder={t("@CALC_STANDARD")} defaultValue="D" mapCode="code" category="BBT_DETAIL" required={true} className="form-select" />
              </div>
            </div>
          </SearchBase>
        }>
        <Row style={{ height: "100%" }}>
          <Row style={{ height: "60%" }}>
              <Col md='12' style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={columnDefs}
                  className="ag-grid-bbt"
                  containerId="grid-bbt-wrap"
                  onCellClicked={cellClickHandler}
                  onGridReady={() => {
                    setList([]);
                  }}
                />
              {/* <Col md={12}>
                <GridBase
                  ref={detailRef}
                  columnDefs={columnDetailDefs()}
                  className="ag-grid-bbt"
                  containerId="grid-detail-wrap"
                  alwaysShowHorizontalScroll={true}
                  onGridReady={() => {
                    setDetailList([]);
                  }}
                />
              </Col> */}
              </Col>
            </Row>
          <Row style={{ height: "40%", paddingTop: '1px' }}>
            <Col md='5' style={{ height: '90%' }}>
            <div style={{ width: '100%', display: 'flex', height: '40px', backgroundColor: '#ddd', borderTop: 'solid 1px #ccc' }}>
              <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px' }} id="workorderTitle">Batch Information</h5></div>
              <div style={{ textAlign: 'right', width: '80px', paddingTop: '8px' }}>
                <Button type="button" size="sm" color="primary" onClick={excelBatchHandler}>
                  <i className="mdi mdi-file-excel me-1"></i> Excel
                </Button>
              </div>
            </div>
            <Row style={{ height: '100%' }}>
                  <Col>
                <GridBase
                    ref={workorderDetailRef}
                    columnDefs={columnWorkorderDefs}
                    className="ag-grid-bbt"
                    containerId="grid-bbt-wrap"
                    alwaysShowHorizontalScroll={true}
                    onCellClicked={cellClickWorkorderHandler}
                    onGridReady={() => {
                      setWorkorderDetailList([]);
                    }}
                  />
                  </Col>
                </Row>
            </Col>
            <Col md='7' style={{ height: '90%' }}>
            <div style={{ width: '100%', display: 'flex', height: '40px', backgroundColor: '#ddd', borderBottom: 'solid 1px #ccc' }}>
              <div style={{ width: "calc(100% - 85px)" }}><h5 style={{ paddingTop: '10px', paddingLeft: '6px'  }} id="panelTitle">Panel Information</h5></div>
              <div style={{ textAlign: 'right', width: '80px', paddingTop: '8px' }}>
                <Button type="button" size="sm" color="primary" onClick={excelDetailHandler}>
                  <i className="mdi mdi-file-excel me-1"></i> Excel
                </Button>
              </div>
            </div>
            {/* <Row style={{ height: 'calc(100% - 42% - 80px)', width: '100%' }}>
              <Col>
                  <div style={{ height: '100%', overflow: 'auto', width: '100%', position: 'absolute' }}>
                  <Table  style={{ width: '1200px', margin: '0' }} bordered>
                    <thead>
                        <tr>
                          <th style={{ textAlign: 'center', width: '100px', fontWeight: 'bold' }}>제일 뒤로 이동</th>
                          <th style={{ textAlign: 'center', width: '140px', fontWeight: 'bold' }} id="scanTimeTitle"></th>
                          <th style={{ textAlign: 'center', width: '200px', fontWeight: 'bold' }} id="eqpCodeTitle"></th>
                          <th style={{ textAlign: 'center', width: '200px', fontWeight: 'bold' }} id="rollIdTitle">Roll ID</th>
                          <th style={{ textAlign: 'center', fontWeight: 'bold' }} colSpan={3}>설비 진행 이력</th>
                        </tr>
                      </thead>
                      <tbody>
                        { getPanelRowData(panelList) }
                      </tbody>
                  </Table>
                </div>
                </Col>
            </Row> */}
            {/* <Row style={{ height: 'calc(100% - 42% - 80px)', width: 'calc(100% + 10px)' }}>
              <Col> */}
                <GridBase
                      ref={panelDetailGridRef}
                      columnDefs={columnPanelDefs}
                      className="ag-grid-bbt"
                      containerId="grid-bbt-wrap"
                      alwaysShowHorizontalScroll={true}
                      onGridReady={() => {
                        setPanelDetailList([]);
                      }}
                    />
                {/* </Col>
              </Row> */}
            </Col>
          </Row>
        </Row>
        </ListBase>
    </>
  );
};

export default BBTDataDetailList;
