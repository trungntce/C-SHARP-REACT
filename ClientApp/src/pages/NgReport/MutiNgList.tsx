import myStyle from "./MutiNg.module.scss";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { Col, Input, Row, Nav, NavItem, NavLink, TabContent, TabPane, Table } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../common/hooks";
import { Dictionary } from "../../common/types";
import { dateFormat } from "../../common/utility";
import AutoCombo from "../../components/Common/AutoCombo";
import GridBase from "../../components/Common/Base/GridBase";
import ListBase from "../../components/Common/Base/ListBase";
import SearchBase from "../../components/Common/Base/SearchBase";
import DateTimePicker from "../../components/Common/DateTimePicker";
import { analysisDefs, paramNgDefs, spcErrorDefs } from "./MutiNgDefs";
import { useTranslation } from "react-i18next";

const MutiNgList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();
  const [gridParamRef, setParamList] = useGridRef();
  const [gridSpcRef, setSpcList] = useGridRef();
  const [gridAnalysisRef, setAnalysisList] = useGridRef();

  // const [param, setParam] = useState<Dictionary[]>([]);
  // const [spc, setSpc] = useState<Dictionary[]>([]);
  // const [anal, setAnal] = useState<Dictionary[]>([]);

  const totalRef1 = useRef<any>(0);
  const totalRef2 = useRef<any>(0);
  const totalRef3 = useRef<any>(0);
  const totalRef4 = useRef<any>(0);
  const totalRef5 = useRef<any>(0);
  const totalRef6 = useRef<any>(0);
  const totalRef7 = useRef<any>(0);
  const totalRef8 = useRef<any>(0);

  const paramRef1 = useRef<any>(0);
  const paramRef2 = useRef<any>(0);
  const paramRef3 = useRef<any>(0);
  const paramRef4 = useRef<any>(0);
  const paramRef5 = useRef<any>(0);
  const paramRef6 = useRef<any>(0);
  const paramRef7 = useRef<any>(0);
  const paramRef8 = useRef<any>(0);
  
  const spcRef1 = useRef<any>(0);
  const spcRef2 = useRef<any>(0);
  const spcRef3 = useRef<any>(0);
  const spcRef4 = useRef<any>(0);
  const spcRef5 = useRef<any>(0);
  const spcRef6 = useRef<any>(0);
  const spcRef7 = useRef<any>(0);
  const spcRef8 = useRef<any>(0);

  const analRef1 = useRef<any>(0);
  const analRef2 = useRef<any>(0);
  const analRef3 = useRef<any>(0);
  const analRef4 = useRef<any>(0);
  const analRef5 = useRef<any>(0);
  const analRef6 = useRef<any>(0);
  const analRef7 = useRef<any>(0);
  const analRef8 = useRef<any>(0);

  const ctqRef1 = useRef<any>(0);
  const ctqRef2 = useRef<any>(0);
  const ctqRef3 = useRef<any>(0);
  const ctqRef4 = useRef<any>(0);
  const ctqRef5 = useRef<any>(0);
  const ctqRef6 = useRef<any>(0);
  const ctqRef7 = useRef<any>(0);
  const ctqRef8 = useRef<any>(0);

  const paramRef = useRef<Dictionary[]>([]);
  const spcRef = useRef<Dictionary[]>([]);
  const analRef = useRef<Dictionary[]>([]);

  const { refetch: refetchParam } = useApi("ngreport/param", getSearch);
  const { refetch: refetchSpc } = useApi("ngreport/spc", getSearch);
  const { refetch: refetchAnal } = useApi("ngreport/anal", getSearch);

  const { refetch: refetchParamTotal } = useApi("ngreport/paramcount", getSearch);
  const { refetch: refetchSpcTotal } = useApi("ngreport/spccount", getSearch);
  const { refetch: refetchAnalTotal } = useApi("ngreport/analcount", getSearch);

  const searchHandler = async (_?:Dictionary) => {
    const param = getSearch();
    const defs = paramNgDefs();
    const spcDefs = spcErrorDefs();

    if(gridParamRef?.current?.api){
      if(param.unit == "pnl")
        gridParamRef.current!.api.setColumnDefs(defs);
      else
        gridParamRef.current!.api.setColumnDefs(defs.filter(x => x.field != "panelId"));
    }
    
    if(gridParamRef?.current?.api)
      gridParamRef!.current!.api.showLoadingOverlay();

    refetchParam().then((result) => {
      setParamList(result.data);
    });

    if(gridSpcRef?.current?.api){
      if(param.unit == "pnl")
        gridSpcRef.current!.api.setColumnDefs(spcDefs.filter(x => x.field != "ngDescription"));
      else
        gridSpcRef.current!.api.setColumnDefs(spcDefs.filter(x => x.field != "panelId" && x.field != "csStatus"));
    }
  
    if(gridSpcRef?.current?.api)
      gridSpcRef!.current!.api.showLoadingOverlay();

    refetchSpc().then((result) => {
      setSpcList(result.data);
    });

    if(gridAnalysisRef?.current?.api)
      gridAnalysisRef!.current!.api.showLoadingOverlay();
      
    refetchAnal().then((result) => {
      setAnalysisList(result.data);
    });

    refetchParamTotal().then((result) => {
      paramRef.current = result.data;
      totalCtq();

      totalRef1.current.innerText = result.data[0].monVal + parseInt(spcRef1.current.innerText) + parseInt(analRef1.current.innerText);
      totalRef2.current.innerText = result.data[0].day7Val + parseInt(spcRef2.current.innerText) + parseInt(analRef2.current.innerText);
      totalRef3.current.innerText = result.data[0].day6Val + parseInt(spcRef3.current.innerText) + parseInt(analRef3.current.innerText);
      totalRef4.current.innerText = result.data[0].day5Val + parseInt(spcRef4.current.innerText) + parseInt(analRef4.current.innerText);
      totalRef5.current.innerText = result.data[0].day4Val + parseInt(spcRef5.current.innerText) + parseInt(analRef5.current.innerText);
      totalRef6.current.innerText = result.data[0].day3Val + parseInt(spcRef6.current.innerText) + parseInt(analRef6.current.innerText);
      totalRef7.current.innerText = result.data[0].day2Val + parseInt(spcRef7.current.innerText) + parseInt(analRef7.current.innerText);
      totalRef8.current.innerText = result.data[0].day1Val + parseInt(spcRef8.current.innerText) + parseInt(analRef8.current.innerText);

      paramRef1.current.innerText = result.data[0].monVal;
      paramRef2.current.innerText = result.data[0].day7Val;
      paramRef3.current.innerText = result.data[0].day6Val;
      paramRef4.current.innerText = result.data[0].day5Val;
      paramRef5.current.innerText = result.data[0].day4Val;
      paramRef6.current.innerText = result.data[0].day3Val;
      paramRef7.current.innerText = result.data[0].day2Val;
      paramRef8.current.innerText = result.data[0].day1Val;
            
    });

    refetchSpcTotal().then((result) => {
      spcRef.current = result.data;
      totalCtq();

      totalRef1.current.innerText = parseInt(paramRef1.current.innerText) + result.data[0].monVal + parseInt(analRef1.current.innerText);
      totalRef2.current.innerText = parseInt(paramRef2.current.innerText) + result.data[0].day7Val + parseInt(analRef2.current.innerText);
      totalRef3.current.innerText = parseInt(paramRef3.current.innerText) + result.data[0].day6Val + parseInt(analRef3.current.innerText);
      totalRef4.current.innerText = parseInt(paramRef4.current.innerText) + result.data[0].day5Val + parseInt(analRef4.current.innerText);
      totalRef5.current.innerText = parseInt(paramRef5.current.innerText) + result.data[0].day4Val + parseInt(analRef5.current.innerText);
      totalRef6.current.innerText = parseInt(paramRef6.current.innerText) + result.data[0].day3Val + parseInt(analRef6.current.innerText);
      totalRef7.current.innerText = parseInt(paramRef7.current.innerText) + result.data[0].day2Val + parseInt(analRef7.current.innerText);
      totalRef8.current.innerText = parseInt(paramRef8.current.innerText) + result.data[0].day1Val + parseInt(analRef8.current.innerText);

      spcRef1.current.innerText = result.data[0].monVal;
      spcRef2.current.innerText = result.data[0].day7Val;
      spcRef3.current.innerText = result.data[0].day6Val;
      spcRef4.current.innerText = result.data[0].day5Val;
      spcRef5.current.innerText = result.data[0].day4Val;
      spcRef6.current.innerText = result.data[0].day3Val;
      spcRef7.current.innerText = result.data[0].day2Val;
      spcRef8.current.innerText = result.data[0].day1Val;
    });

    refetchAnalTotal().then((result) => {
      analRef.current = result.data;
      totalCtq();

      totalRef1.current.innerText = parseInt(paramRef1.current.innerText) + parseInt(spcRef1.current.innerText) + result.data[0].monVal;
      totalRef2.current.innerText = parseInt(paramRef2.current.innerText) + parseInt(spcRef2.current.innerText) + result.data[0].day7Val;
      totalRef3.current.innerText = parseInt(paramRef3.current.innerText) + parseInt(spcRef3.current.innerText) + result.data[0].day6Val;
      totalRef4.current.innerText = parseInt(paramRef4.current.innerText) + parseInt(spcRef4.current.innerText) + result.data[0].day5Val;
      totalRef5.current.innerText = parseInt(paramRef5.current.innerText) + parseInt(spcRef5.current.innerText) + result.data[0].day4Val;
      totalRef6.current.innerText = parseInt(paramRef6.current.innerText) + parseInt(spcRef6.current.innerText) + result.data[0].day3Val;
      totalRef7.current.innerText = parseInt(paramRef7.current.innerText) + parseInt(spcRef7.current.innerText) + result.data[0].day2Val;
      totalRef8.current.innerText = parseInt(paramRef8.current.innerText) + parseInt(spcRef8.current.innerText) + result.data[0].day1Val;

      analRef1.current.innerText = result.data[0].monVal;
      analRef2.current.innerText = result.data[0].day7Val;
      analRef3.current.innerText = result.data[0].day6Val;
      analRef4.current.innerText = result.data[0].day5Val;
      analRef5.current.innerText = result.data[0].day4Val;
      analRef6.current.innerText = result.data[0].day3Val;
      analRef7.current.innerText = result.data[0].day2Val;
      analRef8.current.innerText = result.data[0].day1Val;
    });
  }

  const totalCtq = () => {
    let totalCtq1 = 0;
    let totalCtq2 = 0;
    let totalCtq3 = 0;
    let totalCtq4 = 0;
    let totalCtq5 = 0;
    let totalCtq6 = 0;
    let totalCtq7 = 0;
    let totalCtq8 = 0;

    if(paramRef.current.length > 0) {
      totalCtq1 += paramRef.current[0].monCtqVal;
      totalCtq2 += paramRef.current[0].day7CtqVal;
      totalCtq3 += paramRef.current[0].day6CtqVal;
      totalCtq4 += paramRef.current[0].day5CtqVal;
      totalCtq5 += paramRef.current[0].day4CtqVal;
      totalCtq6 += paramRef.current[0].day3CtqVal;
      totalCtq7 += paramRef.current[0].day2CtqVal;
      totalCtq8 += paramRef.current[0].day1CtqVal;
    }

    if(spcRef.current.length > 0) {
      totalCtq1 += spcRef.current[0].monCtqVal;
      totalCtq2 += spcRef.current[0].day7CtqVal;
      totalCtq3 += spcRef.current[0].day6CtqVal;
      totalCtq4 += spcRef.current[0].day5CtqVal;
      totalCtq5 += spcRef.current[0].day4CtqVal;
      totalCtq6 += spcRef.current[0].day3CtqVal;
      totalCtq7 += spcRef.current[0].day2CtqVal;
      totalCtq8 += spcRef.current[0].day1CtqVal;
    }

    if(analRef.current.length > 0) {
      totalCtq1 += analRef.current[0].monCtqVal;
      totalCtq2 += analRef.current[0].day7CtqVal;
      totalCtq3 += analRef.current[0].day6CtqVal;
      totalCtq4 += analRef.current[0].day5CtqVal;
      totalCtq5 += analRef.current[0].day4CtqVal;
      totalCtq6 += analRef.current[0].day3CtqVal;
      totalCtq7 += analRef.current[0].day2CtqVal;
      totalCtq8 += analRef.current[0].day1CtqVal;
    }

    ctqRef1.current.innerText = totalCtq1;
    ctqRef2.current.innerText = totalCtq2;
    ctqRef3.current.innerText = totalCtq3;
    ctqRef4.current.innerText = totalCtq4;
    ctqRef5.current.innerText = totalCtq5;
    ctqRef6.current.innerText = totalCtq6;
    ctqRef7.current.innerText = totalCtq7;
    ctqRef8.current.innerText = totalCtq8;
  }

  const getParamNgDefs = () => {
    if(!searchRef.current){
      const defs = paramNgDefs();
      return defs.filter(x => x.field != "panelId");
    }
  }

  const getSpcErrorDefs = () => {
    if(!searchRef.current){
      const defs = spcErrorDefs();
      return defs.filter(x => x.field != "panelId" && x.field != "csStatus");
    }
  }

  useEffect(() => {
    searchHandler();
  }, []);

  const dateChange = (x: number) => {
    const now = new Date();
    const year  = now.getFullYear();
    const month  = now.getMonth();
    const day  = now.getDate();
  
    if(x != 0) {
      return dateFormat(new Date(year, month, day - x), "DD") + "일"  
    }else {
      return dateFormat(new Date(year, month, day), "DD") + "일"  
    }
  }

  return(
    <>
      <ListBase
        folder="Report Manage"
        buttons={[]}
        search={
          <SearchBase ref={searchRef} searchHandler={searchHandler}>
            <Row>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="fromDt" defaultValue={moment().add(-1, 'days').toDate()} placeholderText={t("@SEARCH_START_DATE")} required={true} /> {/* 조회시작 */}
              </Col>
              <Col style={{ "maxWidth": "120px" }}> 
                <DateTimePicker name="toDt" placeholderText={t("@SEARCH_END_DATE")}  required={true} /> {/* 조회종료 */}
              </Col>
              <Col>
                <AutoCombo name="eqpCode" sx={{ minWidth: "180px" }} placeholder={t("@COL_EQP_CODE")} mapCode="eqp" />
              </Col>
              <Col>
                <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} mapCode="model" />
              </Col>
              <Col>
                <Input name="modelName" placeholder={t("@COL_MODEL_NAME")} style={{ minWidth: "200px" }} />
              </Col>
              <Col>
                <select name="unit" defaultValue={"lot"} className="form-select" required={true} >
                  <option value="">{t("@COL_UNIT")}</option>
                  <option value="lot">BATCH</option>
                  <option value="pnl">PNL</option>
                </select>
              </Col>

            </Row>
          </SearchBase>
        }>
          <Row style={{ height: "20%" }}>
            <Table className="table table-bordered" size="sm">
              <thead className="table-light">
                <tr>
                  <th>TYPE</th>
                  <th>{dateFormat(new Date(), "MM") + t("@COL_MONTH")}</th>
                  <th>{dateChange(6)}</th>
                  <th>{dateChange(5)}</th>
                  <th>{dateChange(4)}</th>
                  <th>{dateChange(3)}</th>
                  <th>{dateChange(2)}</th>
                  <th>{dateChange(1)}</th>
                  <th>{dateChange(0)}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>TOTAL</th>
                  <th ref={totalRef1}>0</th>
                  <th ref={totalRef2}>0</th>
                  <th ref={totalRef3}>0</th>
                  <th ref={totalRef4}>0</th>
                  <th ref={totalRef5}>0</th>
                  <th ref={totalRef6}>0</th>
                  <th ref={totalRef7}>0</th>
                  <th ref={totalRef8}>0</th>
                </tr>
                <tr>
                  <td>Parameter</td>
                  <td ref={paramRef1}>0</td>
                  <td ref={paramRef2}>0</td>
                  <td ref={paramRef3}>0</td>
                  <td ref={paramRef4}>0</td>
                  <td ref={paramRef5}>0</td>
                  <td ref={paramRef6}>0</td>
                  <td ref={paramRef7}>0</td>
                  <td ref={paramRef8}>0</td>
                  
                </tr>
                <tr>
                  <td>SPC</td>
                  <td ref={spcRef1}>0</td>
                  <td ref={spcRef2}>0</td>
                  <td ref={spcRef3}>0</td>
                  <td ref={spcRef4}>0</td>
                  <td ref={spcRef5}>0</td>
                  <td ref={spcRef6}>0</td>
                  <td ref={spcRef7}>0</td>
                  <td ref={spcRef8}>0</td>
                </tr>
                <tr>
                  <td>{t("@CHEM")}</td>
                  <td ref={analRef1}>0</td>
                  <td ref={analRef2}>0</td>
                  <td ref={analRef3}>0</td>
                  <td ref={analRef4}>0</td>
                  <td ref={analRef5}>0</td>
                  <td ref={analRef6}>0</td>
                  <td ref={analRef7}>0</td>
                  <td ref={analRef8}>0</td>
                </tr>
                <tr>
                  <td style={{ backgroundColor: "#FFEAEA" }}>CTQ</td>
                  <td style={{ backgroundColor: "#FFEAEA" }} ref={ctqRef1}>0</td>
                  <td style={{ backgroundColor: "#FFEAEA" }} ref={ctqRef2}>0</td>
                  <td style={{ backgroundColor: "#FFEAEA" }} ref={ctqRef3}>0</td>
                  <td style={{ backgroundColor: "#FFEAEA" }} ref={ctqRef4}>0</td>
                  <td style={{ backgroundColor: "#FFEAEA" }} ref={ctqRef5}>0</td>
                  <td style={{ backgroundColor: "#FFEAEA" }} ref={ctqRef6}>0</td>
                  <td style={{ backgroundColor: "#FFEAEA" }} ref={ctqRef7}>0</td>
                  <td style={{ backgroundColor: "#FFEAEA" }} ref={ctqRef8}>0</td>
                </tr>
              </tbody>
            </Table>      
          </Row>
          <Row style={{ height: "35%" }}>
            <Col md={12} style={{height: "100%"}}>
              <div className={myStyle.title}>Parameter</div>
              <GridBase
                ref={gridParamRef}
                columnDefs={getParamNgDefs()}
                alwaysShowHorizontalScroll={true}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
              />
            </Col>
          </Row>
          <Row style={{ height: "40%" }}>
            <Col md={6}>
              <div className={myStyle.title}>SPC</div>
              <GridBase
                ref={gridSpcRef}
                columnDefs={getSpcErrorDefs()}
                alwaysShowHorizontalScroll={true}
                tooltipShowDelay={0}
                tooltipHideDelay={1000}
              />
            </Col>
            <Col md={6}>
                <div className={myStyle.title}>{t("@CHEM")}</div> 
                <GridBase
                  ref={gridAnalysisRef}
                  columnDefs={analysisDefs}
                  alwaysShowHorizontalScroll={true}
                  tooltipShowDelay={0}
                  tooltipHideDelay={1000}
                />
            </Col>
          </Row>
        </ListBase>

    </>
  )


}

export default MutiNgList;