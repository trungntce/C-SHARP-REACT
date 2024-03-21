import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import Basic from "../AllCharts/candlestick/Basic";
import Category from "../AllCharts/candlestick/Category";
import ComboCandlestick from "../AllCharts/candlestick/ComboCandlestick";
import Synced from "../AllCharts/candlestick/Synced";

const ChartsCandlestick = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Candlestick Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Basic Candlestick Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div id="basic_candlestick" dir="ltr">
                    <Basic />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">
                    Candlestick Synced with Brush Chart (Combo)
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
                  <div id="combo_candlestick" dir="ltr">
                    <Synced />
                  </div>
                  <div
                    id="combo_candlestick_chart"
                    dir="ltr"
                  >
                    <ComboCandlestick />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Category X-Axis</h4>
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
                    id="category_candlestick"
                    dir="ltr"
                  >
                    <Category />
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

export default ChartsCandlestick;
