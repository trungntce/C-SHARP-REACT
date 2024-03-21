import React from "react";

import { Row, Col, Card, Container, CardHeader, CardBody } from "reactstrap";

import { Link } from "react-router-dom";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//Import charts
import Basicarea from "../AllCharts/area/basicarea";
import Splinearea from "../AllCharts/area/splinearea";
import Datetime from "../AllCharts/area/Datetime";
import NegativeValues from "../AllCharts/area/NegativeValues";
import GithubMonth from "../AllCharts/area/GithubMonth";
import GithubYear from "../AllCharts/area/GithubYear";
import StackedArea from "../AllCharts/area/StackedArea";
// import IrregularTimeseries from "../AllCharts/area/IrregularTimeseries";
import NullValues from "../AllCharts/area/NullValues";

import avatar2 from "../../assets/images/users/avatar-2.jpg";

const ChartsArea = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Area Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Basic Area Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="area_chart_basic" className="apex-charts" dir="ltr">
                    <Basicarea />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Spline Area Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="area_chart_spline" className="apex-charts" dir="ltr">
                    <Splinearea />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">
                    Area Chart - Datetime X - Axis Chart
                  </h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="area_chart_datetime"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Datetime />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">
                    Area with Negative Values Chart
                  </h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="area_chart_negative"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <NegativeValues />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Area Chart - Github Style</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="bg-light">
                    <div
                      id="area_chart-months"
                      className="apex-charts"
                      dir="ltr"
                    >
                      <GithubMonth />
                    </div>
                  </div>

                  <div className="github-style d-flex align-items-center my-2">
                    <div className="flex-shrink-0 me-2">
                      <img
                        className="avatar-sm rounded"
                        src={avatar2}
                        data-hovercard-user-id="634573"
                        alt=""
                      />
                    </div>
                    <div className="flex-grow-1">
                      <Link to="#" className="font-size-14 text-dark fw-medium">coder</Link>
                      <div className="cmeta text-muted font-size-11">
                        <span className="commits text-dark fw-medium"></span>{" "}
                        commits
                      </div>
                    </div>
                  </div>

                  <div className="bg-light">
                    <div
                      id="area_chart-years"
                      className="apex-charts"
                      dir="ltr"
                    >
                      <GithubYear />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Stacked Area Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="area_chart_stacked"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <StackedArea />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Irregular Timeseries Chart</h4>
                  <Link
                    to="https://apexcharts.com/javascript-chart-demos/area-charts/irregular-timeseries/"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="area_chart_irregular"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <IrregularTimeseries />
                  </div>
                </CardBody>
              </Card>
            </Col> */}
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">
                    Area Chart With Null Values Chart
                  </h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="area-missing-null-value"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <NullValues />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ChartsArea;