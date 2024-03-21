import classNames from "classnames";
import moment from "moment";
import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Col, Row, Input, Label, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import { useApi, useGridRef, useSearchRef } from "../../../common/hooks";
import { Dictionary } from "../../../common/types";
import GridBase from "../../../components/Common/Base/GridBase";
import ListBase from "../../../components/Common/Base/ListBase";
import SearchBase from "../../../components/Common/Base/SearchBase";
import DateTimePicker from "../../../components/Common/DateTimePicker";
import { columnDefs, columnRawDefs } from "./CmiDefs";
import { useTranslation } from "react-i18next";

const CmiList = () => {
  const { t } = useTranslation();
  const [searchRef, getSearch] = useSearchRef();

  const [gridRef, setList] = useGridRef();
  const [rawNGRef, setRawNgList] = useGridRef();
  const [rawRef, setRawList] = useGridRef();
  const { refetch } = useApi("cmi", getSearch, gridRef);
  const [navPillTab, setnavPillTab] = useState("1");
  const [topData, setTopData] = useState<Dictionary>([]);

  const searchHandler = async (_?: Dictionary) => {
    const result = await refetch();
    if(result.data) {
      setList(result.data);
      setTopData(result.data[0]);
      setRawNgList(result.data.filter((item: any) => item.specResult === 'NG'));
      setRawList(result.data.filter((item: any) => item.specResult !== 'NG'));
    }
    
  }

  useEffect(() => {
    searchHandler();
  }, []);

  const navPilltoggle = (tab: any) => {
    if (navPillTab !== tab) setnavPillTab(tab);
  };


  return (
    <>
      <ListBase
        folder="Facility Management"
        title="CMI"
        postfix="동도금 두께"
        icon="codepen"
        buttons={[]}
        search={
          <>
            <SearchBase ref={searchRef} searchHandler={searchHandler}>
              <Row>
                <Col> 
                  <DateTimePicker name="fromDt" defaultValue={moment().add(0, 'days').toDate()} placeholderText="조회시작" required={true} />
                </Col>
                <Col> 
                  <DateTimePicker name="toDt" placeholderText="조회종료" required={true} />
                </Col>
              </Row>
            </SearchBase>
            <Row md={3}>
              <Col>
                <Card >
                  <CardHeader >
                    <h6><strong>CMI01(동도금IPQC)</strong></h6>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col><Label className="d-flex justify-content-end">{t("@MEASURED_COUNT")}</Label></Col> {/* 측정수 */}
                      <Col><Input style={{ textAlign: "right" }}   value={!topData ? 0 : topData?.total01} readOnly /></Col>
                      <Col><Label className="d-flex justify-content-end">CHECK </Label></Col>
                      <Col><Input style={{ textAlign: "right" }}  value={0} readOnly  /></Col>
                    </Row>
                    <Row>
                      <Col><Label className="d-flex justify-content-end">OK</Label></Col>
                      <Col><Input style={{ textAlign: "right" }} value={!topData ? 0 : topData?.ok01} readOnly   /></Col>
                      <Col><Label className="d-flex justify-content-end">NG</Label></Col>
                      <Col><Input style={{ textAlign: "right" }} value={!topData ? 0 : topData?.ng01} readOnly   /></Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card >
                  <CardHeader >
                    <h6><strong>CMI02</strong></h6>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col><Label className="d-flex justify-content-end">{t("@MEASURED_COUNT")}</Label></Col>  {/* 측정수 */}
                      <Col><Input style={{ textAlign: "right" }}   value={!topData ? 0 : topData?.total02} readOnly /></Col>
                      <Col><Label className="d-flex justify-content-end">CHECK </Label></Col>
                      <Col><Input style={{ textAlign: "right" }}  value={0} readOnly  /></Col>
                    </Row>
                    <Row>
                      <Col><Label className="d-flex justify-content-end">OK</Label></Col>
                      <Col><Input style={{ textAlign: "right" }} value={!topData ? 0 : topData?.ok02} readOnly   /></Col>
                      <Col><Label className="d-flex justify-content-end">NG</Label></Col>
                      <Col><Input style={{ textAlign: "right" }} value={!topData ? 0 : topData?.ng02} readOnly   /></Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col>
                <Card >
                  <CardHeader >
                    <h6><strong>CMI03</strong></h6>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col><Label className="d-flex justify-content-end">{t("@MEASURED_COUNT")}</Label></Col>  {/* 측정수 */}
                      <Col><Input style={{ textAlign: "right" }}   value={!topData ? 0 : topData?.total03} readOnly /></Col>
                      <Col><Label className="d-flex justify-content-end">CHECK </Label></Col>
                      <Col><Input style={{ textAlign: "right" }}   value={0} readOnly /></Col>
                    </Row>
                    <Row>
                      <Col><Label className="d-flex justify-content-end">OK</Label></Col>
                      <Col><Input style={{ textAlign: "right" }} value={!topData ? 0 : topData?.ok03} readOnly   /></Col>
                      <Col><Label className="d-flex justify-content-end">NG</Label></Col>
                      <Col><Input style={{ textAlign: "right" }} value={!topData ? 0 : topData?.ng03} readOnly   /></Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </>
        }>
          <Row style={{ height: "100%" }}>
            <Col id="grid-bbt-container" style={{height: "50%"}}>
              <GridBase 
                ref={gridRef}
                columnDefs={columnDefs()}
                className="ag-grid-bbt"
                alwaysShowHorizontalScroll={true}
              />
            </Col>
            <Col id="grid-bbt-container" style={{height: "50%"}} md={12}>
              <div>
                <Nav tabs pills>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: navPillTab === "1" })}
                      onClick={() => {
                        navPilltoggle("1");
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="fas fa-home"></i>
                      </span>
                      <span className="d-none d-sm-block">Alram</span>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classNames({ active: navPillTab === "2" })}
                      onClick={() => {
                        navPilltoggle("2");
                      }}
                    >
                      <span className="d-block d-sm-none">
                        <i className="far fa-user"></i>
                      </span>
                      <span className="d-none d-sm-block">Raw Data</span>
                    </NavLink>
                  </NavItem>
                </Nav>
                <TabContent activeTab={navPillTab} className="p-3 text-muted">
                  <TabPane tabId="1">
                    <Col id="grid-bbt-container" >
                        <GridBase 
                          ref={rawNGRef}
                          columnDefs={columnRawDefs()}
                          className="ag-grid-bbt"
                          alwaysShowHorizontalScroll={true}
                          style={{height: "25vh"}}
                        />
                      </Col>
                  </TabPane>
                  <TabPane tabId="2">
                      <Col id="grid-bbt-container" md={12}>
                        <GridBase 
                          ref={rawRef}
                          columnDefs={columnRawDefs()}
                          className="ag-grid-bbt"
                          alwaysShowHorizontalScroll={true}
                          style={{height: "25vh"}}
                        />
                      </Col>
                  </TabPane>
                </TabContent>
              </div>
            </Col>
          </Row>
      </ListBase>
    </>
  );

};

export default CmiList;