import { useRef } from "react";
import { useQueries } from "react-query";
import { Button, Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";
import api from "../../../common/api";
import { useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary, contentType } from "../../../common/types";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import MultiAutoCombo from "../../../components/Common/MultiAutoCombo";
import { alertBox } from "../../../components/MessageBox/Alert";
import { aoiWorstDefs, aoiDetailEqpWorstDefs, aoiEqpWorstDefs } from "./AOIDefectNewDefs";
import AOIDefectNewListChart from "./AOIDefectNewListChart";
import { CellClickedEvent, CellDoubleClickedEvent } from "ag-grid-community";
import { downloadFile, executeIdle, showLoading, yyyymmddhhmmss } from "../../../common/utility";
import AOIDefectEqpListChart from "./AOIDefectEqpListChart";
import { css, Global } from "@emotion/react";
import { showProgress } from "../../../components/MessageBox/Progress";
const mainStyle = css`
.multiautocombo-container > div > div {
  padding-right: 0px!important;
}
.multiautocombo-container > div > div > div {
  width: 60px!important;
}
.multiautocombo-container > div > div > div {
  text-align: right!important;
}
`;
const AOIDefectNewList = () => {
  const [totalDefectRef, getTotalDefect] = useSearchRef();
  const [searchDetailRef, getDetailSearch] = useSearchRef();
  const [aoiWorstRef, setList] = useGridRef();

  const [defectRef, setDefectList] = useGridRef();
  const [defectDetailRef, setDefectDetailList] = useGridRef();

  const chartRef = useRef<any>();
  const chartDetailRef = useRef<any>();
  const modelCodeRef = useRef<any>();
  const modelNameRef = useRef<any>();
  const appCodeRef = useRef<any>();
  const eqpCodeRef = useRef<any>();
  const eqpDateRef = useRef<any>();
  const modelCodeDetRef = useRef<any>();
  const ngCodeRef = useRef<any>();
  const fromDtWorstRef = useRef<any>(null);
  const toDtWorstRef = useRef<any>(null);
  const fromDtEqpRef = useRef<any>(null);
  const toDtEqpRef = useRef<any>(null);
  const operCodeRef = useRef<any>(null);
  const operCodeDetRef = useRef<any>(null);
  const itemCodeRef = useRef<any>(null);
  const itemCodeEqpRef = useRef<any>(null);

  useQueries([
    {
      queryKey: "AOIDefectNew_Yield",
      queryFn: async () => {
        const { data } = await api<any>("get", "aoidefectnew/listmodel", {});

        if(data) {
          setList(data);
        }
      },
      refetchInterval:  10 * 300 * 1000,
    }
  ]);

  const totalDefectHandler = async (_?: Dictionary) => {
    chartRef.current.setLoading(true);
    const params = getTotalDefect();
    if(params["ngCode"]) {
      const list = JSON.parse(params["ngCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["ngCodes"] = values.join(",");
    }
    const resultMon = await api<any>("get", "aoidefectnew/totaldefectchart", params);
    let title = '';
    if (params.modelCode !== undefined && params.modelCode !== null && params.modelCode !== '') {
      title = params.modelCode + "(" + modelCodeRef.current.getValue().label + ")";
    }
    chartRef.current.setChart(resultMon.data, title);
  }

  const searchDetailHandler = async (_?: Dictionary) => {
    chartDetailRef.current.setLoading(true);
    const paramDefect = getTotalDefect();
    const params = getDetailSearch();

    if(!params["modelCode"] && !paramDefect["modelCode"])
    {
      alertBox("모델 코드를 하나 이상 선택하세요.");
      return;
    }

    if(!params["modelCode"]) params["modelCode"] = paramDefect["modelCode"];
    if(!paramDefect["modelCode"]) params["modelCode"] = params["modelCode"];

    if(paramDefect["ngCode"]) {
      const list = JSON.parse(paramDefect["ngCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      paramDefect["ngCodes"] = values.join(",");
      params["ngCodes"] = values.join(",");
    }
  else{
      const list = JSON.parse(params["ngCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      //paramDefect["ngCodes"] = values.join(",");
      params["ngCodes"] = values.join(",");
    }

    let title = '';
    
    if (params["eqpCode"]) {
      const list = JSON.parse(params["eqpCode"] as string);
     // console.log(params["eqpCode"], ':' , list);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      chartDetailRef.current.setEqpList(list);
      params["eqpCodes"] = values.join(",");
      //paramDefect["eqpCodes"] = values.join(",");
    }

   // params.modelCode = paramDefect.modelCode;

    const result = await api<any>("get", "aoidefectnew/detaildefectchart", params);

    chartDetailRef.current.setChart(result.data, title);  
  }

  const cellWorstClick = async (event: CellDoubleClickedEvent<Dictionary>) => {
    await modelCodeRef.current.setValue({value: event.data!.modelCode, label: event.data!.modelName});
    await modelCodeRef.current.setSelect(event.data!.modelCode);
    await operCodeRef.current.setValue({ value: event.data!.operCode, label: event.data!.operName });
    await operCodeRef.current.setSelect(event.data!.operCode);
    modelNameRef.current = event.data!.modelName;

    await totalDefectRef.current.setForm({
      'modelCode': event.data!.modelCode,
      'modelName': event.data!.modelName
    });
    executeIdle(() => {
      totalDefectHandler();
    });
  }

  const cellEqpWorsClick = async (event: CellDoubleClickedEvent<Dictionary>) => { 
    await eqpCodeRef.current.setValue([{ value: event.data!.eqpCode, label: event.data!.eqpName }]);
    await ngCodeRef.current.setValue([{ value: event.data!.ngCode, label: event.data!.ngName }]);
    await searchDetailRef.current.setForm({
      eqpCode: "",
      ngCode: ""
    });
    await searchDetailRef.current.setForm({
      eqpCode: JSON.stringify([{ value: event.data!.eqpCode, label: event.data!.eqpName }]),
      ngCode: JSON.stringify([{ value: event.data!.ngCode, label: event.data!.ngName }])
    });
   
    // await operCodeDetRef.current.setValue({ value: event.data!.operCode, label: event.data!.operName });
    // await operCodeDetRef.current.setSelect(event.data!.operCode);

    executeIdle(() => {
      searchDetailHandler();
    })
  }

  const onClickDefectChart = async (data: any) => { 
    if (!data) {
      return;
    }
    const colData = chartRef.current.getBarChartData(data);
    const params = getTotalDefect();
    params.fromDt = colData.fromDt;
    params.toDt = colData.toDt;
    // for export excel
    fromDtWorstRef.current = colData.fromDt;
    toDtWorstRef.current = colData.toDt;

    if(params["ngCode"]) {
      const list = JSON.parse(params["ngCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["ngCodes"] = values.join(",");
    }
    showLoading(defectRef, true);
    const result = await api<any>("get", "aoidefectnew/listdefectdeqp", params);
    if (result.data) {
      setDefectList(result.data);
    }
  }

  const onClickDefectDetChart = async (data: any) => { 
    if (!data) {
      return;
    }
    const colData = chartDetailRef.current.getBarChartData(data);
    const paramTotal = getTotalDefect();
    const params = getDetailSearch();
    params.modelCode = paramTotal.modelCode;
    params.fromDt = colData.fromDt;
    params.toDt = colData.toDt;
    // for export excel
    fromDtEqpRef.current = colData.fromDt;
    toDtEqpRef.current = colData.toDt;

    if(params["ngCode"]) {
      const list = JSON.parse(params["ngCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["ngCodes"] = values.join(",");
    }
    if(params["eqpCode"]) {
      const list = JSON.parse(params["eqpCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["eqpCodes"] = values.join(",");
    }
    showLoading(defectDetailRef, true);
    const result = await api<any>("get", "aoidefectnew/detaildefecteqp", params);
    if (result.data) {
      setDefectDetailList(result.data);
    }
  }

  const excelWorstHandle = async (e: any) => { 
    e.preventDefault();
    const params = getTotalDefect();
    params.fromDt = fromDtWorstRef.current;
    params.toDt = toDtWorstRef.current;
    params.isExcel = true;

    if(params["ngCode"]) {
      const list = JSON.parse(params["ngCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["ngCodes"] = values.join(",");
    }
    
    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "aoidefectnew/listdefectdeqp", params);
    downloadFile(`AOI_VRS_worst_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    hideProgress();
  }

  const excelEqpHandle = async (e:any) => { 
    const paramTotal = getTotalDefect();
    const params = getDetailSearch();
    params.modelCode = paramTotal.modelCode;
    params.fromDt = fromDtEqpRef.current;
    params.toDt = toDtEqpRef.current;
    params.isExcel = true;

    if(params["ngCode"]) {
      const list = JSON.parse(params["ngCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["ngCodes"] = values.join(",");
    }
    if(params["eqpCode"]) {
      const list = JSON.parse(params["eqpCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["eqpCodes"] = values.join(",");
    }
    
    const { hideProgress, startFakeProgress } = showProgress("Excel export progress", "progress");
    startFakeProgress();

    const result = await api<any>("download", "aoidefectnew/detaildefecteqp", params);
    downloadFile(`AOI_VRS_Eqp_worst_excel_export_${yyyymmddhhmmss()}.xlsx`, contentType.excel, [result.data]);
    hideProgress();
  }

  return (
    <>
      <Global styles={mainStyle} />
     <ListBase
        buttons={[]}
        icon=""
      >
        <div style={{height: "100%",display:"flex"}}>
          <div style={{flex:1.9,height:"100%"}}>
            <GridBase
              ref={aoiWorstRef}
              columnDefs={aoiWorstDefs}
              onCellDoubleClicked={cellWorstClick}
              onGridReady={() => {
                setList([]);
              }}
            />
          </div>
          <div style={{height: '100%', flex:5,display:"flex",flexDirection:"column",margin:"0px 4px"}}>
            <div style={{height: '44%', flex:1,display:"flex",flexDirection:"column",border:"1px solid #babfc7cc",padding:"5px",marginBottom:"2px"}}>
              <div style={{ height: '10%' }}>
                <SearchBase 
                  ref={totalDefectRef}
                  searchHandler={totalDefectHandler}
                  postButtons={
                    <Button type="button" color="primary" onClick={excelWorstHandle}>
                      <i className="mdi mdi-file-excel me-1"></i>{" "}Excel
                    </Button>
                  }
                >
                  <div style={{ width: "30%" }}>
                    <AutoCombo ref={itemCodeRef} name="itemCode" parentname="inventoryItemId" sx={{ width: "100%" }} placeholder="제품코드" mapCode="item" />
                  </div>
                  <div style={{ width: '50%' }} className="search-row">
                    <div style={{ width: "30%" }}>
                      <AutoCombo ref={appCodeRef} name="appCode" sx={{ width: "100%" }} placeholder="어플리케이션" mapCode="app" />
                    </div>
                    <div style={{ width: "33%" }}>
                      <AutoCombo ref={modelCodeRef} name="modelCode" placeholder="모델코드" sx={{ width: "100%" }} mapCode="model" />
                    </div>
                    <div style={{ width: "30%" }}>
                        <AutoCombo ref={operCodeRef} name="operCode" placeholder="공정명" sx={{ width: "100%" }} mapCode="oper" />
                    </div>
                  </div>
                  <div style={{ width: "19%" }}>
                    <MultiAutoCombo limitTags={1} name="ngCode" placeholder="불량 항목" mapCode="code" category="VRS_NG_CODE" maxSelection={20} sx={{ width: "100%" }} />
                  </div>
                </SearchBase>
              </div>
              <div style={{ height: '100%' }}>
                  <AOIDefectNewListChart onClick={onClickDefectChart} ref={chartRef} id={"aoi_01"} title={"월별"} />
              </div>
            </div>
            <div style={{height: '44%', flex:1,display:"flex",flexDirection:"column",border:"1px solid #babfc7cc",padding:"5px",marginTop:"2px"}}>
            <div style={{ height: '10%' }}>
              <SearchBase
                  ref={searchDetailRef}
                  searchHandler={searchDetailHandler}
                  postButtons={
                    <Button type="button" color="primary" onClick={excelEqpHandle}>
                      <i className="mdi mdi-file-excel me-1"></i>{" "}Excel
                    </Button>
                  }
                >
                   <div style={{ width: "15%" }}>
                    <AutoCombo ref={itemCodeEqpRef} name="itemCode" parentname="inventoryItemId" sx={{ width: "100%" }} placeholder="제품코드" mapCode="item" />
                  </div>
                  <div style={{ width: '40%' }} className="search-row">
                      <div style={{ width: "33%" }}>
                        <AutoCombo ref={modelCodeDetRef} name="modelCode" placeholder="모델코드" sx={{ width: "100%" }} mapCode="model" />
                    </div>
                    <div style={{ width: "30%" }}>
                        <AutoCombo name="workcenterCode" placeholder="Work center" sx={{ width: "100%" }} mapCode="workcenter" />
                    </div>
                    <div style={{ width: "30%" }}>
                        <AutoCombo ref={operCodeDetRef} name="operCode" placeholder="공정명" sx={{ width: "100%" }} mapCode="oper" />
                    </div>
                  </div>
                  <div style={{ width: "20%" }}>
                      <MultiAutoCombo ref={eqpCodeRef} limitTags={1} name="eqpCode" placeholder="설비코드" mapCode="eqp" maxSelection={2} sx={{ width: "100%" }} required={true} />
                  </div>
                  <div style={{ width: "20%" }}>
                    <MultiAutoCombo ref={ngCodeRef} limitTags={1} name="ngCode" placeholder="불량 항목" mapCode="code" category="VRS_NG_CODE" maxSelection={10} sx={{ width: "100%" }} />
                  </div>
                </SearchBase>
              </div>
              <div style={{ height: '100%' }}>
                <AOIDefectEqpListChart onClick={onClickDefectDetChart} ref={chartDetailRef} id={"aoi_detail_01"} title={"월별"} />
              </div>
            </div>
          </div>
          <div style={{flex:1.8,display:"flex",flexDirection:"column"}}>
            <Row style={{height: "50%",marginBottom:"2px"}}>
              <GridBase 
                ref={defectRef}
                onCellDoubleClicked={cellEqpWorsClick}
                columnDefs={aoiEqpWorstDefs}
                onGridReady={() => {
                  setDefectList([]);
                }}
              />
            </Row>
            <Row style={{height: "50%",marginTop:"2px"}}>
              <GridBase 
                ref={defectDetailRef}
                columnDefs={aoiDetailEqpWorstDefs}
                onGridReady={() => {
                  setDefectDetailList([]);
                }}
              />
            </Row>
          </div>
        </div>
      </ListBase>
    </>
  )
}

export default AOIDefectNewList;
