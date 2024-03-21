import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Card, Container, CardHeader, CardBody } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Basic from "../AllCharts/bar/basic";
import CustomDataLabel from "../AllCharts/bar/customDataLabel";
import Stacked from "../AllCharts/bar/stacked";
import Stacked2 from "../AllCharts/bar/stacked2";
import Negative from "../AllCharts/bar/negative";
import Markers from "../AllCharts/bar/markers";
import Reversed from "../AllCharts/bar/reversed";
import Patterned from "../AllCharts/bar/patterned";
import Groupes from "../AllCharts/bar/groupes";
import BarWithImages from "../AllCharts/bar/barWithImages";

const ChartsBar = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Bar Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Basic Bar Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="bar_chart" className="apex-charts" dir="ltr">
                    <Basic />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Custom DataLabels Bar</h4>
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
                    id="custom_datalabels_bar"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <CustomDataLabel />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Stacked Bar Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="stacked_bar" className="apex-charts" dir="ltr">
                    <Stacked />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Stacked Bars 100</h4>
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
                    id="stacked_bar_100"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Stacked2 />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Bar with Negative Values</h4>
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
                    id="negative_bars"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Negative />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Bar with Markers</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="bar_markers" className="apex-charts" dir="ltr">
                    <Markers />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Reversed Bar Chart</h4>
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
                    id="reversed_bars"
                    className="apex-charts"

                  >
                    <Reversed />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Patterned Chart</h4>
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
                    id="patterned_bars"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Patterned />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Grouped Bar Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="grouped_bar" className="apex-charts" dir="ltr">
                    <Groupes />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Bar with Images</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="bar_images" className="apex-charts" dir="ltr">
                    <BarWithImages />
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

export default ChartsBar;