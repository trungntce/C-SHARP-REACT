import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Basic from "../AllCharts/radialbar/Basic";
import Circle from "../AllCharts/radialbar/Circle";
import GradientCircle from "../AllCharts/radialbar/GradientCircle";
import Multiple from "../AllCharts/radialbar/Multiple";
import SemiCircular from "../AllCharts/radialbar/SemiCircular";
import StrokedCircular from "../AllCharts/radialbar/StrokedCircular";

const ChartsRadialbar = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Radialbar Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Basic Radialbar Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="basic_radialbar" className="apex-charts" dir="ltr">
                    <Basic />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Multiple Radialbar</h4>
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
                    id="multiple_radialbar"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Multiple />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Circle Chart - Custom Angle</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="circle_radialbar" className="apex-charts" dir="ltr">
                    <Circle />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Gradient Circle Chart</h4>
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
                    id="gradient_radialbar"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <GradientCircle />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <div className="row mb-4">
            <Col lg={6}>
              <div className="card h-100 mb-xl-0">
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Stroked Circular Gauge</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="stroked_radialbar" className="apex-charts" dir="ltr">
                    <StrokedCircular />
                  </div>
                </CardBody>
              </div>
            </Col>
            <Col lg={6}>
              <div className="card h-100 mb-xl-0">
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Semi Circular Gauge</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="semi_radialbar" className="apex-charts" dir="ltr">
                    <SemiCircular />
                  </div>
                </CardBody>
              </div>
            </Col>
          </div>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ChartsRadialbar;
