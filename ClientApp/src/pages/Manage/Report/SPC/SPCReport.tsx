import { CellDoubleClickedEvent, RowClassParams, RowSelectedEvent } from "ag-grid-community";
import { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button, Col, Input, Label, Row, Table } from "reactstrap";
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
import { ColumnDefs, DetailColumnDefs } from "./SPCReportDefs";
import style from "./SPCList.module.scss";
import { downloadFile, executeIdle, showLoading, toQueryString, yyyymmddhhmmss } from "../../../../common/utility";
import ChartRange from "./ChartRange";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showProgress } from "../../../../components/MessageBox/Progress";
import Select from "../../../../components/Common/Select";
import XbarChart from "./XbarChart";
import RChart from "./RChart";
import { Width } from "devextreme-react/chart";
import { date } from "yup";
import { flexbox } from "@mui/system";
import { useSearchParams } from "react-router-dom";

const SPCReport = () => {
  const { t } = useTranslation();

  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  const [searchParams, setSearchParam] = useSearchParams();

  //조회조건
  const colRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [ngGridRef, setNgList] = useGridRef();
  const [detailGridRef, setDetail] = useGridRef();

  const fromDtRef = useRef<any>();
  const toDtRef = useRef<any>();
  const itemRef = useRef<any>();
  const operRef = useRef<any>();
  const inspectRef = useRef<any>();
  const eqpRef = useRef<any>();


  const [specStatus, setSpecStatus] = useState<any>({
    max : -1,
    min : -1,
    valueAvg : -1,
    sigma : -1,

      //규격값
    usl : -1,
    lsl : -1,
    cl : -1,

      //관리값
    count : -1,
    ucl : -1,
    lcl : -1,

      //공정능력
    cp : -1,
    k : -1,
    cpk : -1,
  }
  );

  const totalChartRef = useRef<any>();
  const topChartRef = useRef<any>();
  const botChartRef = useRef<any>();

  const { refetch } = useApi("spcreport", getSearch, gridRef);

  const setSearchList = (data:any) => {
    if(data){
      setList(data);


      // valueAvg
      // sigma
      // usl
      // (usl+lsl / 2)
      // lsl
      // valueAdd3Sigma
      // valueSub3Sigma

      let totalCount = 0;
      let max = -1;
      let min = 999999;
      data.map((x : any, i : number) => {
        totalCount = i+1;
        max < x.max ? max = x.max : max;
        min > x.min ? min = x.min : min;
      })

      const spec : any = {};

      //측정값
      spec.max = max;
      spec.min = min;
      spec.valueAvg = data[0].valueAvg;
      spec.sigma = data[0].sigma;

      //규격값
      spec.usl = data[0].usl;
      spec.lsl = data[0].lsl;
      spec.cl = ( data[0].usl + data[0].lsl ) / 2;

      //관리값
      spec.count = totalCount;
      spec.ucl = data[0].xbarCalcUcl;
      spec.lcl = data[0].xbarCalcLcl;

      //공정능력
      spec.cp = data[0].cp;
      spec.k = data[0].k;
      spec.cpk = data[0].cpk;

      setSpecStatus(spec);

      


      const ngFilter = data.filter((x : any) => x.statusFlag !== 'OK');
      ngFilter.length > 0 ? setNgList(ngFilter) : setNgList([]);
      //ngFilter.length > 0 ? console.log('0000') : console.log('1111');
      


      totalChartRef.current.resetChart();
      topChartRef.current.resetChart();
      // botChartRef.current.resetChart();
      if(data){
        const list = data;
        totalChartRef.current.setChart(list[0], [...list]);
        topChartRef.current.setChart(list[0], [...list]);
        // botChartRef.current.setChart(list[3], list.slice(-3));
      }
    }
  }

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    setSearchList(result.data);
    // if(result.data){
    //   setList(result.data);


    //   // valueAvg
    //   // sigma
    //   // usl
    //   // (usl+lsl / 2)
    //   // lsl
    //   // valueAdd3Sigma
    //   // valueSub3Sigma

    //   let totalCount = 0;
    //   let max = -1;
    //   let min = 999999;
    //   result.data.map((x : any, i : number) => {
    //     totalCount = i+1;
    //     max < x.max ? max = x.max : max;
    //     min > x.min ? min = x.min : min;
    //   })

    //   const spec : any = {};

    //   //측정값
    //   spec.max = max;
    //   spec.min = min;
    //   spec.valueAvg = result.data[0].valueAvg;
    //   spec.sigma = result.data[0].sigma;

    //   //규격값
    //   spec.usl = result.data[0].usl;
    //   spec.lsl = result.data[0].lsl;
    //   spec.cl = ( result.data[0].usl + result.data[0].lsl ) / 2;

    //   //관리값
    //   spec.count = totalCount;
    //   spec.ucl = result.data[0].xbarCalcUcl;
    //   spec.lcl = result.data[0].xbarCalcLcl;

    //   //공정능력
    //   spec.cp = result.data[0].cp;
    //   spec.k = result.data[0].k;
    //   spec.cpk = result.data[0].cpk;

    //   setSpecStatus(spec);

      


    //   const ngFilter = result.data.filter((x : any) => x.statusFlag !== 'OK');
    //   ngFilter.length > 0 ? setNgList(ngFilter) : setNgList([]);
    //   //ngFilter.length > 0 ? console.log('0000') : console.log('1111');
      


    //   totalChartRef.current.resetChart();
    //   topChartRef.current.resetChart();
    //   // botChartRef.current.resetChart();
    //   if(result.data){
    //     const list = result.data;
    //     totalChartRef.current.setChart(list[0], [...list]);
    //     topChartRef.current.setChart(list[0], [...list]);
    //     // botChartRef.current.setChart(list[3], list.slice(-3));
    //   }
    // }
  }

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }

  const rowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

    console.log(e.data)
    const data = {
      inspectionDate:e.data.inspDate,
      itemCode:e.data.itemCode,
      modelCode:e.data.modelCode,
      workorder:e.data.workorder,
      operSeqNo:e.data.operSeqNo,
      operCode:e.data.operCode,
      inspectionDesc:e.data.inspectionDesc,
      lsl:e.data.lsl,
      usl:e.data.usl,
      eqpCode:e.data.eqpCode,
      
    }


    api<any>("get", "spcreport/detaillist", data).then((result) => {
      setDetail(result.data)

    });

    groupChartSearchHandler(e.data);
    detailSearchHandler(e.data);
  }

  const detailRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

      // chartSearchHandler(e.data);
  }  
  
  const detailSearchHandler = (row: Dictionary) => {
    showLoading(detailGridRef, true);
    // api("get", "spcreport/detaillist", row).then((result: Dictionary) => {
    //   if(result.data)
    //     console.log(result.data);
    //     setDetail(result.data);
    // });
  }

  const excelHandler = async (e:any) => {
    e.preventDefault();

    const rows = gridRef.current!.api.getSelectedRows();
    if (!rows.length) {
      alertBox(t("@@MSG_NO_SELECTED_ROW")); //선택된 행이 없습니다.
      return;
    }

    if(detailGridRef.current!.api.getDisplayedRowCount() <= 0)
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
    // totalChartRef.current.showLoading(true);
    // topChartRef.current.showLoading(true);
    // botChartRef.current.showLoading(true);

    // api("get", "cuplatingex/chart", row).then((result: Dictionary) => {
    //   if(result.data){
    //     const list = result.data;

    //     totalChartRef.current.setChart(list[0], list);
    //     topChartRef.current.setChart(list[0], list.slice(0, 3));
    //     botChartRef.current.setChart(list[3], list.slice(-3));
    //   }
    // });
  }

  const groupChartSearchHandler = (row: Dictionary) => {
    // totalChartRef.current.showLoading(true);
    // topChartRef.current.showLoading(true);
    // botChartRef.current.showLoading(true);
    // console.log(row)

    // api("get", "spcreport/detaillist", row).then((result: Dictionary) => {
    //   if(result.data){
    //     const list = result.data;
    //     // console.log(result)
    //     // totalChartRef.current.setChart(list[0], list);
    //     // topChartRef.current.setChart(list[0], list.slice(0, 3));
    //     // botChartRef.current.setChart(list[3], list.slice(-3));
    //   }
    // });
  }

  const setSpcdescription = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    colRef.current.setCategory(value?.value);
  };

  useEffect(() => {
    // searchHandler();
    // const params = new URLSearchParams(window.location.pathname);

    
  // searchRef
  // gridRef
  // ngGridRef
  // detailGridRef
    gridRef

    showLoading(gridRef, false);
    showLoading(ngGridRef, false);
    showLoading(detailGridRef, false);
    
    const fromDt = searchParams.get('fromDt');
    const toDt = searchParams.get('toDt');
    const itemCode = searchParams.get('itemCode');
    const operCode = searchParams.get('operCode');
    const eqpCode = searchParams.get('eqpCode');
    const inspectDesc = searchParams.get('inspectDesc');
    const judge = 'JUDGE';


    
    if(fromDt && toDt && itemCode && operCode && inspectDesc && eqpCode){ 


      
      api<any>("get", "/spcreport", {fromDt, toDt, itemCode, eqpCode, operCode, inspectDesc, judge}).then((result) => {
        setSearchList(result.data);

        setTimeout(() => {
          toDtRef.current.setDate(new Date(toDt));
          fromDtRef.current.setDate(new Date(fromDt));
  
          itemRef.current.setValue(itemCode);
          operRef.current.setValue(operCode);
          colRef.current.setValue(inspectDesc);
          eqpRef.current.setValue(eqpCode);
        }, 1000);
      });
      // groupChartSearchHandler(e.data);
      // detailSearchHandler(e.data);
    }


    
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
                {/* <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>             */}
              </>
            }>




          <div className="search-row">
            <div style={{ maxWidth: "115px" }}>
              <DateTimePicker name="fromDt" ref={fromDtRef} defaultValue={moment().add(-7, 'days').toDate()} placeholderText={t("@SEARCH_START_DATE")} required={true} /> {/* 조회시작 */}
            </div>
            <div style={{ maxWidth: "115px" }}>
              <DateTimePicker name="toDt" ref={toDtRef} placeholderText={t("@SEARCH_END_DATE")} required={true} /> {/* 조회종료 */}
            </div>
            {/* <div>
              <AutoCombo name="eqpCode" sx={{ minWidth: "130px" }} placeholder="설비코드" mapCode="eqp"  category="M-108-03-V001-" />
            </div> */}
            <div>
              <AutoCombo name="itemCode" ref={itemRef} sx={{ minWidth: "150px" }} placeholder={t("@COL_ITEM_CODE")} mapCode="item" required={true} /> {/* 제품코드 */}
            </div>
            <div>
              <AutoCombo onChange={setSpcdescription} ref={operRef} name="operCode" sx={{ minWidth: "120px", width:"130px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="oper" required={true} /> {/* 공정코드 */}
            </div>
            <div>
              <AutoCombo ref={colRef}  name="inspectDesc" sx={{ minWidth: "170px", width:"180px" }} placeholder={t("@INSPECTION_NAME")} mapCode="spcdescription" category = '' required={true} /> {/* 검사명 */}
            </div>

            {/* <div>
              <Input name="itemName" placeholder="제품명" style={{ width: "150px"}} />
            </div> */}
            <div>
                <AutoCombo name="eqpCode" ref={eqpRef} sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" required={true} />  
            </div>
            <div>
              <AutoCombo name="modelCode" sx={{ minWidth: "180px" }} placeholder={t("@COL_MODEL_CODE")} mapCode="model"  />
            </div>
            <div>
              <select name="judge" className="form-select">
                  <option value="SHOW">{t("@VIEWER_STD")}</option> {/* 뷰어기준 */}
                  <option value="JUDGE">{t("@COL_JUDGMENT_REFERENCE")}</option> {/* 판정기준 */}
              </select>
            </div>

            {/* <div>
              <Input innerRef={lotNoRef} name="workorder" type="text" style={{ minWidth: 180 }} className="form-control" placeholder="BATCH(WORKORDER)" />  
            </div> */}
            {/* <div style={{ maxWidth: 180 }}>
              <Button type="button" color="info" style={{ width: 110 }} onClick={() => {
                lotSearchRef.current.setShowModal(true);
              }}>
                <i className="fa fa-fw fa-search"></i>{" "}
                LOT 검색
              </Button>
            </div> */}
          </div>
        </SearchBase>
        }>
        <Row style={{ height: "100%" }}>
          <Col md={4}>
            <Row style={{ height: "50%" }}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={gridRef}
                  columnDefs={ColumnDefs()}
                  onRowSelected={rowSelectedHandler}
                  rowMultiSelectWithClick={false}
                  onGridReady={() => {
                    setList([]);
                  }}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}
                />
              </div>
            </Row>
            <Row style={{ height: "25%" }}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={detailGridRef}
                  columnDefs={DetailColumnDefs()}
                  // onRowSelected={rowSelectedHandler}
                  rowMultiSelectWithClick={false}
                  onGridReady={() => {
                    setDetail([]);
                  }}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}
                />
              </div>
            </Row>
            <Row style={{ height: "25%" }}>
              <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={ngGridRef}
                    columnDefs={ColumnDefs()}
                    onRowSelected={rowSelectedHandler}
                    rowMultiSelectWithClick={false}
                    onGridReady={() => {
                      setNgList([]);
                    }}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                  />
                </div>
            </Row>
          </Col>
          <Col md={8}>
            <Row style={{height:"10%"}} className={`${style.detailSpec__warpper}`}>
              <div style={{height:"100%",width:"100%",padding:"0px 4px"}}>
                  <div className={style.layout}>
                    <div className={style.gridlayout} >
                      <div className={style.gridHeader} style={{ }}>{t("@MEASURED_VALUE")}</div> {/* 측정값 */}
                      <div>{`${t("@COL_MAX")}(MAX)`}</div> {/* 최대 */}
                      <div>{`${t("@COL_MIN")}(MIN`}</div>{/* 최소 */}
                      <div>{`${t("@COL_AVG")}(AVG)`}</div>{/* 평균 */}
                      <div>{`${t("@STANDARD_DEVIATION")}(S)`}</div>{/* 표준편차 */}
                      <div>{Number(specStatus.max).toFixed(3)}</div>
                      <div>{Number(specStatus.min).toFixed(3)}</div>
                      <div>{Number(specStatus.valueAvg).toFixed(3)}</div>
                      <div>{Number(specStatus.sigma).toFixed(3)}</div>
                    </div>
                    <div className={style.gridlayout}>
                      <div className={style.gridHeader}>{t("@STANDARD_VALUE")}</div>{/* 규격값 */}
                      <div>{`${t("@CENTER_VALUE")}(STD)`}</div>{/* 중심값(STD) */}
                      <div>{`${t("@UPPER_LIMIT_VALUE")}(USL)`}</div>{/* 상한값(USL) */}
                      <div>{`${t("@LOWER_LIMIT_VALUE")}(USL)`}</div>{/* 하한값(LSL) */}
                      <div></div>
                      <div>{Number(specStatus.cl).toFixed(3)}</div>
                      <div>{Number(specStatus.usl).toFixed(3)}</div>
                      <div>{Number(specStatus.lsl).toFixed(3)}</div>
                      <div></div> 
                    </div> 
                      <div className={style.gridlayout} >
                      <div className={style.gridHeader}>{t("@CONTROL_VALUE")}</div>{/* 관리값 */}
                      <div>{`${t("@SAMPLE_WATER")}(n)`}</div>{/* 시료수 */}
                      <div>UCL</div>
                      <div>LCL</div>
                      <div></div>
                      <div>{Number(specStatus.count).toFixed(0)}</div>
                      <div>{Number(specStatus.ucl).toFixed(3)}</div>
                      <div>{Number(specStatus.lcl).toFixed(3)}</div>
                      <div></div>
                    </div>               
                    <div className={style.gridlayout}>
                      <div className={style.gridHeader}>{t("@OPER_CAPABILITY")}</div>{/* 공정능력 */}
                      <div>Cp</div>
                      <div>K</div>
                      <div>Cpk</div>
                      <div></div>
                      <div>{Number(specStatus.cp).toFixed(3)}</div>
                      <div>{Number(specStatus.k).toFixed(3)}</div>
                      <div>{Number(specStatus.cpk).toFixed(3)}</div>
                      <div></div>
                    </div>
                  </div>
              </div>
            </Row>
            <Row style={{ height: "65%", marginTop: '15px'}}>
              <div>
                <div className={style.chartTitle}>X-BAR Chart</div>
                <XbarChart 
                  id={"cu-total"}
                  ref={totalChartRef}
                  />
              </div>
            </Row>
            <Row style={{ height: "20%" , marginTop: '15px' }}>
              <div>
                <div className={style.chartTitle}>R Chart</div>
                  <RChart 
                    id={"cu-topa"}
                    ref={topChartRef}
                  />
              </div>
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

export default SPCReport;