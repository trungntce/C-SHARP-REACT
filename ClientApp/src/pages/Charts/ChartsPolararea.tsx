import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Basic from "../AllCharts/polararea/Basic";
import PolarArea from "../AllCharts/polararea/PolarArea";

const ChartsPolararea = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Polararea Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Basic-Polar Area Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="basic_polar_area" dir="ltr">
                    <Basic />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Polar-Area Monochrome</h4>
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
                    id="monochrome_polar_area"
                    dir="ltr"
                  >
                    <PolarArea />
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

export default ChartsPolararea;
