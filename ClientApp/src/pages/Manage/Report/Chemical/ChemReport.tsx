import { CellDoubleClickedEvent, RowClassParams, RowSelectedEvent } from "ag-grid-community";
import { SyntheticEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { ColumnDefs, DetailColumnDefs } from "./ChemReportDefs";
import style from "./ChemList.module.scss";
import { downloadFile, showLoading, yyyymmddhhmmss } from "../../../../common/utility";
import ChartRange from "./ChartRange";
import { alertBox } from "../../../../components/MessageBox/Alert";
import { showProgress } from "../../../../components/MessageBox/Progress";
import Select from "../../../../components/Common/Select";
import IChart from "./IChart";
import MrChart from "./MrChart";


const ChemReport = () => {
  const { t } = useTranslation();

  const lotNoRef = useRef<any>();
  const lotSearchRef = useRef<any>();

  //약품 쿼리 조건
  const colRef = useRef<any>();

  const [searchRef, getSearch] = useSearchRef();
  const [gridRef, setList] = useGridRef();
  const [ngGridRef, setNgList] = useGridRef();
  const [detailGridRef, setDetail] = useGridRef();

  const [dataList, setDataList] = useState<any>();

  const [chemSpec, setChemSpec] = useState<any>({
    valueMax : -1,
    valueMin : -1,
    valueAvg : -1,
    valueSigma : -1,
    valueUsl : -1,
    valueLsl : -1,
    valueMiddle : -1,
    valueCount : -1,
    valueUpperSigma : -1,
    valueLowerSigma : -1,
    valueUpperOneSigma : -1,
    valueLowerOneSigma : -1,
    valueOk : -1,
    valueUpperNg : -1,
    valueLowerNg : -1,
    valueCpk : -1,
  });

  const totalChartRef = useRef<any>();
  const iChartRef = useRef<any>();
  const mrChartRef = useRef<any>();
  const topChartRef = useRef<any>();
  const botChartRef = useRef<any>();

  const { refetch } = useApi("chemreport", getSearch, gridRef);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();

    if(result.data){
      setList(result.data);
      setDataList(result.data);

      const ngList = result.data.filter((x : any) => x.statusFlag !== 'OK');
      setNgList(ngList);

      // totalChartRef.current.resetChart();
      // topChartRef.current.resetChart();
      // botChartRef.current.resetChart();
      // if(result.data){
      //   const list = result.data;
      //   totalChartRef.current.setChart(list[0], [...list]);
      //   topChartRef.current.setChart(list[0], [...list]);
      //   // botChartRef.current.setChart(list[3], list.slice(-3));
      // }
    }
  }

  const lotSelectedHandler = (lot: Dictionary) => {
    lotNoRef.current.value = lot.workorder;

    searchHandler();
  }

  const rowSelectedHandler = async (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;


    const detailRequest = await api<any>("get", "chemreport/detaillist", (e.data)).then((result: Dictionary) => {
      if(result.data){
        setDetail(result.data);
        console.log(result.data)
      }
    });
    // console.log(dataList)


    
    const filteredData = dataList.filter((x : any) => x.chemName === e.data.chemName 
                                                  &&  x.factorDesc === e.data.factorDesc
                                                  &&  x.eqpCode === e.data.eqpCode
                                                  &&  x.chemName === e.data.chemName
                                                  );

    // console.log(filteredData)

    
    // const ngList = filteredData.filter((x : any) => x.statusFlag !== 'OK');

    const valueList : number[] = [];

    let valueSum : number = 0;
    let max = -10;
    let min = 99999;
    let count = 0;
    let bunsan = 0;
    // setNgList(ngList);
    
    
    const list : any[] = [];

    filteredData.map((x : any, i : number) => {
      valueList.push(x.value);

      x.value > max ? max = x.value : max;
      x.value < min ? min = x.value : min;



      const data = filteredData[i];
      // if(i !== 0){
      //   data.range = Math.max(filteredData[i].value  , filteredData[i-1].value) - Math.min(filteredData[i].value  , filteredData[i-1].value);
      // }else {
      //   // const data = filteredData[i];
      //   data.range = null;
      // }
      list.push(data)

      valueSum += x.value;
      count += 1;
    })

    let upperNg = 0;
    let lowerNg = 0;

    filteredData.map((x : any) => {
      bunsan += (x.value - valueSum/count) * (x.value - valueSum/count);

      if(x.value > x.usl) upperNg++;
      if(x.value < x.lsl) lowerNg++;
    });

    const valueMax = max;
    const valueMin = min;
    const valueAvg = valueSum/count;
    const valueSigma = Math.sqrt(bunsan/count);
    const valueUsl = filteredData[0].usl;
    const valueLsl = filteredData[0].lsl;
    const valueUcl = filteredData[0].ucl;
    const valueLcl = filteredData[0].lcl;
    const valueMiddle = (valueUsl + valueLsl) / 2;
    const valueCount = count;
    const valueUpperSigma = valueAvg  + (valueSigma*3)
    const valueLowerSigma = valueAvg  - (valueSigma*3)
    const valueUpperOneSigma = valueAvg  + (valueSigma)
    const valueLowerOneSigma = valueAvg  - (valueSigma)
    const valueNormalValue = count - upperNg - lowerNg;
    const valueUpperNg = upperNg;
    const valueLowerNg = lowerNg;
    const valueCpk = (valueUsl - valueLsl) / (6 * valueSigma);

    
    const spec : any = {};

    spec.valueMax = valueMax;
    spec.valueMin = valueMin;
    spec.valueAvg = valueAvg;
    spec.valueSigma = valueSigma;
    spec.valueUsl = valueUsl;
    spec.valueLsl = valueLsl;
    spec.valueUcl = valueUcl;
    spec.valueLcl = valueLcl;
    spec.valueMiddle = valueMiddle;
    spec.valueCount = valueCount;
    spec.valueUpperSigma = valueUpperSigma;
    spec.valueLowerSigma = valueLowerSigma;
    spec.valueUpperOneSigma = valueUpperOneSigma;
    spec.valueLowerOneSigma = valueLowerOneSigma;
    spec.valueOk = valueNormalValue;
    spec.valueUpperNg = valueUpperNg;
    spec.valueLowerNg = valueLowerNg;
    spec.valueCpk = valueCpk;

    setChemSpec(spec);





    if(list.length > 0){
      iChartRef.current.resetChart();
      // mrChartRef.current.resetChart();
      // botChartRef.current.resetChart();
  
      iChartRef.current.setChart(spec, [...filteredData]);
      // mrChartRef.current.setChart(list[0], [...list]);
      // botChartRef.current.setChart(list[3], list.slice(-3));
  
      groupChartSearchHandler(e.data);
      detailSearchHandler(e.data);
    }
  }

  const detailRowSelectedHandler = (e: RowSelectedEvent) => {
    if(!e.node.isSelected())
      return;

      // chartSearchHandler(e.data);
  }  
  
  const detailSearchHandler = (row: Dictionary) => {
    // showLoading(detailGridRef, true);
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
      alertBox(t("@MSG_NO_SELECTED_ROW"));  //선택된 행이 없습니다.
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

  const setChemSearch = (
    event: SyntheticEvent<Element, Event>,
    value: Dictionary | null
  ) => {
    colRef.current.setCategory(value?.value);
  };

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
                {/* <Button type="button" color="outline-primary" onClick={excelHandler}>
                  <i className="mdi mdi-file-excel me-1"></i>{" "}
                  Excel
                </Button>             */}
              </>
            }>
          <div className="search-row">
            <div style={{ maxWidth: "115px" }}>
              <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText={t("@SEARCH_START_DATE")} required={true} /> {/* 조회시작 */}
            </div>
            <div style={{ maxWidth: "115px" }}>
              <DateTimePicker name="toDt" placeholderText= {t("@SEARCH_END_DATE")} required={true} />  {/* 조회종료 */}
            </div>
            <div>   
              <AutoCombo onChange={setChemSearch} name="operClass" sx={{ minWidth: "120px", width:"130px" }} placeholder={t("@COL_OPERATION_CODE")} mapCode="operclass" required={true} /> {/* 공정코드 */}
            </div>
            <div>
              <AutoCombo name="eqpCode" sx={{ minWidth: "200px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp"  required={true}  /> {/* 설비코드 */}
            </div>
            <div>
              <AutoCombo ref={colRef} name="chemicalList" sx={{ minWidth: "120px", width:"130px" }} placeholder={t("@CHEM")} mapCode="chemicallist"  /> {/* 약품 */}
            </div>
            <div>
              <select name="isTotal" className="form-select">
                  <option value="A">{t("@TOTAL")}</option> {/* 전체 */}
                  <option value="B">{t("@CORRECTION")}</option> {/* 보정 */}
              </select>
            </div>
          </div>
        </SearchBase>
        }>

        <Row style={{ height: "100%" }}>
          <Col md={4}>
            <Row style={{ height: "75%" }}>
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
            </Row>
            <Row style={{ height: "25%" }}>
              <div className="pb-2" style={{ height: "100%" }}>
                <GridBase
                  ref={ngGridRef}
                  columnDefs={ColumnDefs()}
                  onRowSelected={detailRowSelectedHandler}
                  rowMultiSelectWithClick={false}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}                    
                  onGridReady={() => {
                    // setDetail([]);
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
            </Row>
            <Row style={{ height: "25%" }}>
              {/* <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={ngGridRef}
                    columnDefs={ColumnDefs}
                    onRowSelected={rowSelectedHandler}
                    rowMultiSelectWithClick={false}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                  />
                </div> */}
            </Row>
          </Col>
          <Col md={8}>
            <Row style={{height:"10%"}} className={`${style.detailSpec__warpper}`}>
              <div style={{height:"100%",width:"100%",padding:"0px 4px"}}>
                  <div className={style.layout}>
                    <div className={style.gridlayout} >
                      <div className={style.gridHeader} style={{ }}>{t("@MEASURED_VALUE")}</div>  {/* 측정값 */}
                      <div>{`${t("@COL_MAX")}(MAX)`}</div> {/* 최대 */}
                      <div>{`${t("@COL_MIN")}(MIN`}</div>{/* 최소 */}
                      <div>{`${t("@COL_AVG")}(AVG)`}</div>{/* 평균 */}
                      <div>{`${t("@STANDARD_DEVIATION")}(S)`}</div>{/* 표준편차 */}
                      <div>{chemSpec.valueMax.toFixed(2)}</div>
                      <div>{chemSpec.valueMin.toFixed(2)}</div>
                      <div>{chemSpec.valueAvg.toFixed(2)}</div>
                      <div>{chemSpec.valueSigma.toFixed(2)}</div>
                    </div>
                    <div className={style.gridlayout}>
                      <div className={style.gridHeader}>{t("@STANDARD_VALUE")}</div>  {/* 규격값 */}
                      <div>{`${t("@CENTER_VALUE")}(STD)`}</div>{/* 중심값(STD) */}
                      <div>{`${t("@UPPER_LIMIT_VALUE")}(USL)`}</div>{/* 상한값(USL) */}
                      <div>{`${t("@LOWER_LIMIT_VALUE")}(USL)`}</div>{/* 하한값(LSL) */}
                      <div></div>
                      <div>{chemSpec.valueMiddle.toFixed(2)}</div>
                      <div>{chemSpec.valueUsl.toFixed(2)}</div>
                      <div>{chemSpec.valueLsl.toFixed(2)}</div>
                      <div></div> 
                    </div> 
                      <div className={style.gridlayout} >
                      <div className={style.gridHeader}>{t("@CONTROL_VALUE")}</div>  {/* 관리값 */}
                      <div>{`${t("@SAMPLE_WATER")}(n)`}</div>{/* 시료수 */}
                      <div>{`${t("@UPPER_LIMIT_VALUE")}(+3σ)`}</div>{/* 상한값(+3σ) */}
                      <div>{`${t("@LOWER_LIMIT_VALUE")}(-3σ)`}</div>{/* 하한값(-3σ) */}
                      <div></div>
                      <div>{chemSpec.valueCount.toFixed(0)}</div>
                      <div>{chemSpec.valueUpperSigma.toFixed(2)}</div>
                      <div>{chemSpec.valueLowerSigma.toFixed(2)}</div>
                      <div></div>
                    </div>               
                    <div className={style.gridlayout}>
                      <div className={style.gridHeader}>{t("@OPER_CAPABILITY")}</div>  {/* 공정능력 */}
                      <div>{t("@NORMAL")}</div>  {/* 정상 */}
                      <div>{`${t("@UPPER_LIMIT")}NG`}</div>  {/* 상한NG */}
                      <div>{`${t("@LOWER_LIMIT")}NG`}</div>  {/* 하한NG */}
                      <div>Cpk</div>
                      <div>{chemSpec.valueOk.toFixed(2)}</div>
                      <div>{chemSpec.valueUpperNg.toFixed(2)}</div>
                      <div>{chemSpec.valueLowerNg.toFixed(2)}</div>
                      <div>{chemSpec.valueCpk.toFixed(2)}</div>
                      <div></div>
                    </div>
                  </div>
              </div>
            </Row>
            <Row style={{ height: "65%", marginTop: '15px'}}>
              <div>
                <div className={style.chartTitle}>I Chart</div>
                <IChart 
                  id={"cu-total"}
                  ref={iChartRef}
                />
              </div>
            </Row>
            <Row style={{ height: "25%" , marginTop: '-15px' }}>
              <div className="pb-2" style={{ height: "100%" }}>
                  <GridBase
                    ref={detailGridRef}
                    columnDefs={ColumnDefs()}
                    onRowSelected={rowSelectedHandler}
                    rowMultiSelectWithClick={false}
                    tooltipShowDelay={0}
                    tooltipHideDelay={1000}
                  />
                </div>
            </Row>
          </Col>
        </Row>


        {/* <Row style={{ height: "60%" }}>
          <Col md={7}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={gridRef}
                columnDefs={ColumnDefs}
                onRowSelected={rowSelectedHandler}
                rowMultiSelectWithClick={false}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
              />
            </div>
          </Col>
          <Col md={5} style={{ height: "100%" }}>
            <Row style={{ height: "50%" }}>
              <IChart 
                id={"cu-total"}
                ref={iChartRef}
              />
            </Row>            
            <Row style={{ height: "50%" }}>
              <MrChart
                id={"cu-top"}
                ref={mrChartRef}
              />
            </Row>
          </Col>
        </Row>
        <Row style={{ height: "40%" }}>
          <Col md={7} style={{ height: "100%" }}>
            <div className="pb-2" style={{ height: "100%" }}>
              <GridBase
                ref={ngGridRef}
                columnDefs={ColumnDefs}
                onRowSelected={detailRowSelectedHandler}
                rowMultiSelectWithClick={false}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}                    
                onGridReady={() => {
                  setDetail([]);
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
          <Col md={7} style={{ height: "100%" }}>
            <Row style={{ height: "100%" }}>
              <Col md={6} style={{ height: "100%" }}>
                
              </Col>
              <Col md={6} style={{ height: "100%" }}>
                <ChartRange 
                  id={"cu-bot"}
                  ref={botChartRef}
                />
              </Col>
            </Row>
          </Col>
        </Row> */}
      </ListBase>

      <LotSearch
        ref={lotSearchRef}
        onLotSelected={lotSelectedHandler}
      />
    
    </>
  )
}

export default ChemReport;