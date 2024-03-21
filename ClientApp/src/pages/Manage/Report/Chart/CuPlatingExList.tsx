import { CellDoubleClickedEvent, RowClassParams, RowSelectedEvent } from "ag-grid-community";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Input, Label, Row } from "reactstrap";
import api from "../../../../common/api";
import { useApi, useEditRef, useGridRef, useSearchRef } from "../../../../common/hooks";
import { contentType, Dictionary } from "../../../../common/types";
import GridBase from "../../../../components/Common/Base/GridBase";
import ListBase from "../../../../components/Common/Base/ListBase";
import SearchBase from "../../../../components/Common/Base/SearchBase";
import AutoCombo from "../../../../components/Common/AutoCombo";
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { useTranslation } from "react-i18next";
import DateTimePicker from "../../../../components/Common/DateTimePicker";
import moment from "moment";
import LotSearch from "../../../Trace/LotSearch";
import { ColumnDefs, PanelColumnDefs } from "./CuPlatingExDefs";
import style from "./CuPlatingEx.module.scss";
import { downloadFile, showLoading, yyyymmddhhmmss } from "../../../../common/utility";
import ChartRange from "./ChartRange";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showProgress } from "../../../../components/MessageBox/Progress";

const CuPlatingExList = () => {
  const { t } = useTranslation();

  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [panelGridRef, setPanelList] = useGridRef();

  const totalChartRef = useRef<any>();
  const topChartRef = useRef<any>();
  const botChartRef = useRef<any>();

  const { refetch } = useApi("cuplatingex", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data){
      setList(result.data);

      setPanelList([]);

      totalChartRef.current.resetChart();
      topChartRef.current.resetChart();
      botChartRef.current.resetChart();
    }
  }

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    groupChartSearchHandler(e.data);
    panelSearchHandler(e.data);
  }

  const panelRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

      chartSearchHandler(e.data);
  }  
  
  const panelSearchHandler = (row: Dictionary) => {
    showLoading(panelGridRef, true);
    api("get", "cuplatingex/panel", row).then((result: Dictionary) => {
      if(result.data)
        setPanelList(result.data);
    });
  }

  const excelHandler = async (e:any) => {
    e.preventDefault();

    const rows = gridRef.current!.api.getSelectedRows();
    if (!rows.length) {
      alertBox(t("@MSG_NO_SELECTED_ROW")); //선택된 행이 없습니다.
      return;
    }

    if(panelGridRef.current!.api.getDisplayedRowCount() <= 0)
    {
      alertBox(t("@MSG_ALRAM_TYPE4"));  //데이터가 없습니다.
      return;
    }

    const param = rows[0];
    param.isExcel = true;

    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "cuplatingex/panel", param);
    downloadFile(`cuplating_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    
    hideProgress();
  };

  const chartSearchHandler = (row: Dictionary) => {
    totalChartRef.current.showLoading(true);
    topChartRef.current.showLoading(true);
    botChartRef.current.showLoading(true);

    api("get", "cuplatingex/chart", row).then((result: Dictionary) => {
      if(result.data){
        const list = result.data;

        totalChartRef.current.setChart(list[0], list);
        topChartRef.current.setChart(list[0], list.slice(0, 3));
        botChartRef.current.setChart(list[3], list.slice(-3));
      }
    });
  }

  const groupChartSearchHandler = (row: Dictionary) => {
    totalChartRef.current.showLoading(true);
    topChartRef.current.showLoading(true);
    botChartRef.current.showLoading(true);

    api("get", "cuplatingex/groupchart", row).then((result: Dictionary) => {
      if(result.data){
        const list = result.data;

        totalChartRef.current.setChart(list[0], list);
        topChartRef.current.setChart(list[0], list.slice(0, 3));
        botChartRef.current.setChart(list[3], list.slice(-3));
      }
    });
  }

  useEffect(() => {
    searchHandler();
  }, [])

  return (
    <>
      <ListBase
        editHandler={() => {
        }}
        className={style.cupWrap}
        buttons={[]}
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
            }>
          <div className="search-row">
            <div style={{ maxWidth: "115px" }}>
              <DateTimePicker name="fromDt" defaultValue={moment().add(-3, 'days').toDate()} placeholderText="조회시작" required={true} />
            </div>
            <div style={{ maxWidth: "115px" }}>
              <DateTimePicker name="toDt" defaultValue={moment().add(1, 'days').toDate()} placeholderText="조회종료" required={true} />
            </div>
            <div>
              <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" category="M-108-03-V001-" />
            </div>
            <div>
              <AutoCombo name="itemCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item" />
            </div>
            <div>
              <AutoCombo name="modelCode" sx={{ minWidth: "220px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
            </div>
            <div>
              <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 180 }} className="form-control" placeholder="LOT(WORKORDER)" />  
            </div>
            <div style={{ maxWidth: 180 }}>
              <Button type="button" color="info" style={{ width: 110 }} onClick={() => {
                lotSearchRef.current.setShowModal(true);
              }}>
                <i className="fa fa-fw fa-search"></i>{" "}
                {`LOT ${t("@SEARCH")}`}
              </Button>
            </div>
          </div>
        </SearchBase>
        }>
        <Row style={{ height: "60%" }}>
          <Col md={7}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={gridRef}
                columnDefs={ColumnDefs()}
                onRowSelected={rowSelectedHandler}
                rowMultiSelectWithClick={false}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
              />
            </div>
          </Col>
          <Col md={5} style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={panelGridRef}
                columnDefs={PanelColumnDefs()}
                onRowSelected={panelRowSelectedHandler}
                rowMultiSelectWithClick={false}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}                    
                onGridReady={() => {
                  setPanelList([]);
                }}
                rowClassRules={{
                  'judge-ok-row': (param: RowClassParams) => { 
                    return param.data.ngCnt <= 0;
                  },
                  'judge-ng-row': (param: RowClassParams) => { 
                    return param.data.ngCnt > 0;
                  },
                }}
              />
            </div>
          </Col>
        </Row>
        <Row style={{ height: "40%" }}>
          <Col md={5} style={{ height: "100%" }}>
            <ChartRange 
              id={"cu-total"}
              ref={totalChartRef}
            />
          </Col>
          <Col md={7} style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
              <Col md={6} style={{ height: "100%" }}>
                <ChartRange 
                  id={"cu-top"}
                  ref={topChartRef}
                />
              </Col>
              <Col md={6} style={{ height: "100%" }}>
                <ChartRange 
                  id={"cu-bot"}
                  ref={botChartRef}
                />
              </Col>
            </Row>
          </Col>
        </Row>
      </ListBase>

      <LotSearch
        ref={lotSearchRef}
        onLotSelected={lotSelectedHandler}
      />
    
    </>
  )
}

export default CuPlatingExList;