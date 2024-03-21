import React from "react";

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Container,
  CardHeader,
} from "reactstrap";
//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

// import chartJs
import DountChart from "../AllCharts/chartjs/dountchart";
import PieChart from "../AllCharts/chartjs/piechart";
import BarChart from "../AllCharts/chartjs/barchart";
import RadarChart from "../AllCharts/chartjs/radarchart";

const ChartjsChart = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs folder="Charts" breadcrumbItem="Chartjs Charts" />
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <CardTitle>Bar Chart</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">2541</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">84845</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">12001</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <BarChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <CardTitle>Pie Chart</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">2536</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">69421</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">89854</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <PieChart />
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader>
                  <CardTitle>Donut Chart</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">9595</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">36524</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">62541</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <DountChart />
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader>
                  <CardTitle>Radar Chart</CardTitle>
                </CardHeader>
                <CardBody>
                  <Row className="justify-content-center">
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">694</h5>
                        <p className="text-muted">Activated</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">55210</h5>
                        <p className="text-muted">Pending</p>
                      </div>
                    </Col>
                    <Col sm={4}>
                      <div className="text-center">
                        <h5 className="mb-0 font-size-20">489498</h5>
                        <p className="text-muted">Deactivated</p>
                      </div>
                    </Col>
                  </Row>

                  <RadarChart />
                </CardBody>
              </Card>
            </Col>
          </Row>{" "}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ChartjsChart;
