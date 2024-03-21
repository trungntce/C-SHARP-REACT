import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Basic from "../AllCharts/line/Basic";
import Zoomable from "../AllCharts/line/Zoomable";
import DataLabels from "../AllCharts/line/DataLabels";
import DashedLine from "../AllCharts/line/DashedLine";
import Annotations from "../AllCharts/line/Annotations";
import Syncing from "../AllCharts/line/Syncing";
import SyncingArea from "../AllCharts/line/SyncingArea";
import Brush from "../AllCharts/line/Brush";
import BrushLine2 from "../AllCharts/line/BrushLine2";
import Stepline from "../AllCharts/line/Stepline";
import Gradient from "../AllCharts/line/Gradient";
import MissingData from "../AllCharts/line/MissingData";
import Annotations2 from "../AllCharts/line/Annotations2";
// import DynamicChart from "../AllCharts/line/DynamicChart";

const ChartsLine = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Line Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Basic Line Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="line_chart_basic" className="apex-charts" dir="ltr">
                    <Basic />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Zoomable Timeseries</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="line_chart_zoomable"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Zoomable />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Line with Data Labels</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="line_chart_datalabel"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <DataLabels />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Dashed Line</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="line_chart_dashed" className="apex-charts" dir="ltr">
                    <DashedLine />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Line with Annotations</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="line_chart_annotations"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Annotations />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Syncing Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="apex-charts" dir="ltr">
                    <div id="syncingchart-line">
                      <Syncing />
                    </div>
                    <div id="syncingchart-area">
                      <SyncingArea />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Brush Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div
                      id="brushchart_line2"
                      className="apex-charts"
                      dir="ltr"
                    >
                      <Brush />
                    </div>
                    <div id="brushchart_line" className="apex-charts" dir="ltr">
                      <BrushLine2 />
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Stepline Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="line_chart_stepline"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Stepline />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Gradient Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="line_chart_gradient"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Gradient />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Missing Data/ Null Value Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="line_chart_missing_data"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <MissingData />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Realtimes Charts</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="line_chart_missing_data"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <MissingData />
                  </div>
                </CardBody>
              </Card>
            </Col>
            
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Line with Annotations</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="line_chart_annotations"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Annotations2 />
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

export default ChartsLine;
