import React from "react";
import { Link } from "react-router-dom";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Donut from "../AllCharts/pie/Donut";
import GradientDonut from "../AllCharts/pie/GradientDonut";
import ImageFill from "../AllCharts/pie/ImageFill";
import Monochrome from "../AllCharts/pie/Monochrome";
import PatternedDonut from "../AllCharts/pie/PatternedDonut";
import Simple from "../AllCharts/pie/Simple";
import UpdatingDonut from "../AllCharts/pie/UpdatingDonut";

const ChartsPie = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Pie Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Simple Pie Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="simple_pie_chart" className="apex-charts" dir="ltr">
                    <Simple />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Simple Donut Chart</h4>
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
                    id="simple_dount_chart"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Donut />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Updating Donut Chart</h4>
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
                    id="updating_donut_chart"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <UpdatingDonut />
                  </div>

                  <div className="d-flex align-items-start flex-wrap gap-2 justify-content-center mt-4">
                    <button id="add" className="btn btn-light btn-sm">
                      + ADD
                    </button>

                    <button id="remove" className="btn btn-light btn-sm">
                      - REMOVE
                    </button>

                    <button id="randomize" className="btn btn-light btn-sm">
                      RANDOMIZE
                    </button>

                    <button id="reset" className="btn btn-light btn-sm">
                      RESET
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Monochrome Pie Chart</h4>
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
                    id="monochrome_pie_chart"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Monochrome />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Gradient Donut Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="gradient_chart" className="apex-charts" dir="ltr">
                    <GradientDonut />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Patterned Donut Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="pattern_chart" className="apex-charts" dir="ltr">
                    <PatternedDonut />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Pie Chart with Image Fill</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="image_pie_chart" className="apex-charts" dir="ltr">
                    <ImageFill />
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

export default ChartsPie;
