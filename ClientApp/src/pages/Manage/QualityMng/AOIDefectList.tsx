import { useRef } from "react";
import { useQueries } from "react-query";
import { Card, CardBody, CardHeader, Col, Input, Row } from "reactstrap";
import api from "../../../common/api";
import { useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import AutoCombo from "../../../components/Common/AutoCombo";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import MultiAutoCombo from "../../../components/Common/MultiAutoCombo";
import { aoiWorstDefs } from "./AOIDefectDefs";
import AOIDefectListChart from "./AOIDefectListChart";
import { useTranslation } from "react-i18next";

const AOIDefectList = () => {
  const { t } = useTranslation();
  const [totalDefectRef, getTotalDefect] = useSearchRef();
  const [searchDetailRef, getDetailSearch] = useSearchRef();
  const [aoiWorstRef, setList] = useGridRef();

  const [defectRef, setDefectList] = useGridRef();
  const [defectDetailRef, setDefectDetailList] = useGridRef();

  const chartMonRef = useRef<any>();
  const chartWeekRef = useRef<any>();
  const chartDayRef = useRef<any>();
  
  const chartDetailMonRef = useRef<any>();
  const chartDetailWeekRef = useRef<any>();
  const chartDetailDayRef = useRef<any>();
  // const chartDetailRef = useRef<any>();

  useQueries([
    {
      queryKey: "AOIMonitering_Yield",
      queryFn: async () => {
        const { data } = await api<any>("get", "aoidefect", {});

        if(data) {
          setList(data);
        }
      },
      refetchInterval:  10 * 60 * 1000,
    }
  ]);

  const totalDefectHandler = async (_?: Dictionary) => {
    const params = getTotalDefect();
    if(params["layer"]) {
      const list = JSON.parse(params["layer"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["layers"] = values.join(",");
    }

    const resultMon = await api<any>("get", "aoidefect/totalmondefect", params);
    const resultWeek = await api<any>("get", "aoidefect/totalweekdefect", params);
    const resultDay = await api<any>("get", "aoidefect/totaldaydefect", params);

    if(resultMon.data) {
      chartMonRef.current.setChart(resultMon.data,"here-product-code");  
    }
    if(resultWeek.data) {
      chartWeekRef.current.setChart(resultWeek.data,"here-product-code");  
    }
    if(resultDay.data) {
      chartDayRef.current.setChart(resultDay.data,"here-product-code");  
    }
  }

  const searchDetailHandler = async (_?: Dictionary) => {
    const params = getDetailSearch();
    if(params["layer"]) {
      const list = JSON.parse(params["layer"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["layers"] = values.join(",");
    }

    if(params["ngCode"]) {
      const list = JSON.parse(params["ngCode"] as string);
      const values = list.filter((y: any) => y.value).map((x: any) => x.value);
      params["ngCodes"] = values.join(",");
    }


    // const result = await api<any>("get", "aoidefect/detaildefect", params);

    const resultMon = await api<any>("get", "aoidefect/detailmondefect", params);
    const resultWeek = await api<any>("get", "aoidefect/detailweekdefect", params);
    const resultDay = await api<any>("get", "aoidefect/detaildaydefect", params);

    if(resultMon.data) {
      chartDetailMonRef.current.setChart(resultMon.data,"here-product-code");  
    }
    if(resultWeek.data) {
      chartDetailWeekRef.current.setChart(resultWeek.data,"here-product-code");  
    }
    if(resultDay.data) {
      chartDetailDayRef.current.setChart(resultDay.data,"here-product-code");  
    }

  }

  return (
    <>
     <ListBase
        buttons={[]}
      >
        <div style={{height: "100%",display:"flex"}}>
          <div style={{flex:1.9,height:"100%"}}>
            <GridBase
              ref={aoiWorstRef}
              columnDefs={aoiWorstDefs()}
              onGridReady={() => {
                setList([]);
              }}
            />
          </div>
          <div style={{flex:5,display:"flex",flexDirection:"column",margin:"0px 4px"}}>
            <div style={{flex:1,display:"flex",flexDirection:"column",border:"1px solid #babfc7cc",padding:"5px",marginBottom:"2px"}}>
              <div>
                <SearchBase 
                  ref={totalDefectRef}
                  searchHandler={totalDefectHandler}
                >
                  <div className="search-row">
                    <div style={{ maxWidth: "115px" }}>
                      <DateTimePicker name="toDt" placeholderText={`${t("@LOOKUP")}${t("@COL_DATE_TYPE2")}`} required={true} /> {/* 조회일자 */}
                    </div>
                    <div>
                      <AutoCombo name="appCode" sx={{ minWidth: "150px" }} placeholder={t("@APPLICATION")} mapCode="app" /> {/* 어플리케이션 */}
                    </div>
                    <div>
                      <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} sx={{ minWidth: "100px" }} mapCode="model" /> {/* 모델코드 */}
                    </div>
                    <div>
                      <Input name="modelName" placeholder={t("@COL_MODEL_NAME")} style={{ minWidth: "100px" }} /> {/* 모델명 */}
                    </div>
                    <div style={{ minWidth: "410px" }}>
                      <MultiAutoCombo name="layer" placeholder={t("@INSPECTION_LAYER")} mapCode="code" category="AOI_LAYER" maxSelection={20} sx={{ width: "100%" }} /> {/* 검사층 */}
                    </div>
                  </div>
                </SearchBase>
              </div>
              <div style={{flex:5,display:"flex",justifyContent:"space-around",alignItems:"center"}}>
                  <AOIDefectListChart ref={chartMonRef} id={"aoi_01"} title={t("@MONTHLY")} /> {/*월별*/}
                  <AOIDefectListChart ref={chartWeekRef} id={"aoi_02"} title={t("@WEEKLY")} /> {/*주별*/}
                  <AOIDefectListChart ref={chartDayRef} id={"api_03"} title={t("@DAILY")} /> {/*일별*/}
              </div>
            </div>
            <div style={{flex:1,display:"flex",flexDirection:"column",border:"1px solid #babfc7cc",padding:"5px",marginTop:"2px"}}>
              <div>
              <SearchBase
                    ref={searchDetailRef}
                    searchHandler={searchDetailHandler}
                  >
                    <div className="search-row">
                      <div style={{ maxWidth: "200px" }}>
                        <AutoCombo name="eqpCode" placeholder={t("@COL_EQP_CODE")} mapCode="eqp" required={true} /> {/* 설비코드 */}
                      </div>
                      <div style={{ maxWidth: "115px" }}>
                        <DateTimePicker name="toDt" placeholderText={`${t("@LOOKUP")}${t("@COL_DATE_TYPE2")}`} required={true} /> {/* 조회일자 */}
                      </div>
                      <div>
                        <AutoCombo name="appCode" sx={{ minWidth: "150px" }} placeholder={t("@APPLICATION")} mapCode="app" /> {/* 어플리케이션 */}
                      </div>
                      <div>
                        <AutoCombo name="modelCode" placeholder={t("@COL_MODEL_CODE")} sx={{ minWidth: "120px" }} mapCode="model" /> {/* 모델코드 */}
                      </div>
                      <div>
                        <Input name="modelName" placeholder={t("@COL_MODEL_NAME")} style={{ minWidth: "100px" }} /> {/* 모델명 */}
                      </div>
                      <div style={{ minWidth: "410px" }}>
                        <MultiAutoCombo name="layer" placeholder={t("@INSPECTION_LAYER")} mapCode="code" category="AOI_LAYER" maxSelection={20} sx={{ width: "100%" }} /> {/* 검사층 */}
                      </div>
                      <div style={{ minWidth: "410px" }}>
                        <MultiAutoCombo name="ngCode" placeholder={t("@DEFECTIVE_ITEMS")} mapCode="code" category="VRS_NG_CODE" maxSelection={20} sx={{ width: "100%" }} /> {/* 불량 항목 */}
                      </div>
                    </div>
                  </SearchBase>
              </div>
              <div style={{flex:5,display:"flex",justifyContent:"space-around",alignItems:"center"}}>
                <AOIDefectListChart ref={chartDetailMonRef} id={"aoi_detail_01"} title={t("@MONTHLY")} /> {/*월별*/}
                <AOIDefectListChart ref={chartDetailWeekRef} id={"aoi_detail_02"} title={t("@WEEKLY")} /> {/*주별*/}
                <AOIDefectListChart ref={chartDetailDayRef} id={"aoi_detail_03"} title={t("@DAILY")} /> {/*일별*/}
              </div>
            </div>
          </div>
          <div style={{flex:1.8,display:"flex",flexDirection:"column"}}>
            <Row style={{height: "50%",marginBottom:"2px"}}>
              <div style={{display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid",fontWeight:"bold",fontSize:"1.2rem"}}>
               {t("@DEFECT_BY_PNL")} {/*설비별 불량률*/}
              </div>
              {/* <GridBase 
                ref={defectRef}
                onGridReady={() => {
                  setDefectList([]);
                }}
              /> */}
            </Row>
            <Row style={{height: "50%",marginTop:"2px"}}>
              <div style={{display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid",fontWeight:"bold",fontSize:"1.2rem"}}>
               {t("@DEFECT_BY_PNL")} {/*pnl 별 불량률*/}
              </div>
              {/* <GridBase 
                ref={defectDetailRef}
                onGridReady={() => {
                  setDefectDetailList([]);
                }}
              /> */}
            </Row>
          </div>
          {/* <Col md={3}>
            <GridBase
              ref={aoiWorstRef}
              columnDefs={aoiWorstDefs}
              onGridReady={() => {
                setList([]);
              }}
            />
          </Col>
          <Col md={7}>
            <Row style={{height: "50%"}}>
              <Card>
                <CardHeader>
                  <SearchBase
                    ref={totalDefectRef}
                    searchHandler={totalDefectHandler}
                  >
                    <div className="search-row">
                      <div style={{ maxWidth: "115px" }}>
                        <DateTimePicker name="toDt" placeholderText="조회일" required={true} />
                      </div>
                      <div>
                        <AutoCombo name="appCode" sx={{ minWidth: "170px" }} placeholder="어플리케이션" mapCode="app" />
                      </div>
                      <div>
                        <AutoCombo name="modelCode" placeholder="모델코드" sx={{ minWidth: "120px" }} mapCode="model" />
                      </div>
                      <div>
                        <Input name="modelName" placeholder="모델명" style={{ minWidth: "200px" }} />
                      </div>
                      <div style={{ minWidth: "450px" }}>
                        <MultiAutoCombo name="layer" placeholder="검사층" mapCode="code" category="AOI_LAYER" maxSelection={20} sx={{ width: "100%" }} />
                      </div>
                    </div>
                  </SearchBase>
                </CardHeader>
                <CardBody>
                  <div style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around"}}>
                    <AOIDefectListChart ref={chartMonRef} id={"aoi_01"} title={"월별"} />
                    <AOIDefectListChart ref={chartWeekRef} id={"aoi_02"} title={"주별"} />
                    <AOIDefectListChart ref={chartDayRef} id={"api_03"} title={"일별"} />
                  </div>
                </CardBody>
              </Card>
            </Row>
            <Row style={{height: "50%"}}>
              <Card>
                <CardHeader>
                  <SearchBase
                    ref={searchDetailRef}
                    searchHandler={searchDetailHandler}
                  >
                    <div className="search-row">
                      <div style={{ maxWidth: "200px" }}>
                        <AutoCombo name="eqpCode" sx={{ minWidth: "120px" }} placeholder="장비코드" mapCode="eqp" required={true} />
                      </div>
                      <div style={{ maxWidth: "115px" }}>
                        <DateTimePicker name="toDt" placeholderText="조회일" required={true} />
                      </div>
                      <div>
                        <AutoCombo name="appCode" sx={{ minWidth: "120px" }} placeholder="어플리케이션" mapCode="app" />
                      </div>
                      <div>
                        <AutoCombo name="modelCode" placeholder="모델코드" sx={{ minWidth: "120px" }} mapCode="model" />
                      </div>
                      <div>
                        <Input name="modelName" placeholder="모델명" style={{ minWidth: "120px" }} />
                      </div>
                      <div style={{ minWidth: "400px" }}>
                        <MultiAutoCombo name="layer" placeholder="검사층" mapCode="code" category="AOI_LAYER" maxSelection={20} sx={{ width: "100%" }} />
                      </div>
                      <div style={{ minWidth: "400px" }}>
                        <MultiAutoCombo name="ngCode" placeholder="불량 항목" mapCode="code" category="VRS_NG_CODE" maxSelection={20} sx={{ width: "100%" }} />
                      </div>
                    </div>
                  </SearchBase>
                </CardHeader>
                <CardBody>
                  <div style={{display: "flex", flexDirection: "row", flexWrap: "nowrap", justifyContent: "space-around"}}>
                    <AOIDefectListChart ref={chartDetailMonRef} id={"aoi_detail_01"} title={"월별"} />
                    <AOIDefectListChart ref={chartDetailWeekRef} id={"aoi_detail_02"} title={"주별"} />
                    <AOIDefectListChart ref={chartDetailDayRef} id={"aoi_detail_03"} title={"일별"} />
                  </div>

                </CardBody>
              </Card>
            </Row>
          </Col>
          <Col md={2}>
              <Row style={{height: "50%"}}>
                <GridBase 
                  ref={defectRef}
                  onGridReady={() => {
                    setDefectList([]);
                  }}
                />
              </Row>
              <Row style={{height: "50%"}}>
                <GridBase 
                  ref={defectDetailRef}
                  onGridReady={() => {
                    setDefectDetailList([]);
                  }}
                />
              </Row>
          </Col> */}
        </div>
      </ListBase>
    </>
  )
}

export default AOIDefectList;