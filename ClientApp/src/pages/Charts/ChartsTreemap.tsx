import React from "react";

import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";
import { Link } from "react-router-dom";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Basic from "../AllCharts/treemap/Basic";
import ColorRanges from "../AllCharts/treemap/ColorRanges";
import Distributed from "../AllCharts/treemap/Distributed";
import MultiDimensional from "../AllCharts/treemap/MultiDimensional";

const ChartsTreemap = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Treemap Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Basic Treemap Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="basic_treemap" className="apex-charts" dir="ltr">
                    <Basic />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">
                    Multi-Dimensional Treemap Chart
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
                  <div id="multi_treemap" className="apex-charts" dir="ltr">
                    <MultiDimensional />
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
                    Distributed Treemap Chart (Different Color for each Cell)
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
                    id="distributed_treemap"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <Distributed />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">
                    Treemap Chart with Color Ranges
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
                    id="color_range_treemap"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <ColorRanges />
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

export default ChartsTreemap;
