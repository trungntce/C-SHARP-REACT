import React from "react";
import {Link} from "react-router-dom";
import { Row, Col, Card, CardBody, Container, CardHeader } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ThreeDBubble from "../AllCharts/bubble/3DBubble";
import Simple from "../AllCharts/bubble/Simple";

const ChartsBubble = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs folder="Charts" breadcrumbItem="Bubble Charts" />

          <Row>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Simple Bubble Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div id="simple_bubble" className="apex-charts" dir="ltr">
                    <Simple />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">3D Bubble Chart</h4>
                  <Link
                    to="//www.npmjs.com/package/react-apexcharts"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs{" "}
                    <i className="mdi mdi-arrow-right align-middle">
                      
                    </i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div
                    id="bubble_chart"
                    className="apex-charts"
                    dir="ltr"
                  >
                    <ThreeDBubble />
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

export default ChartsBubble;
