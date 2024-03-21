import React from "react";
import { Container, Row, Col, Card, CardBody } from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiColors = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="Ui Elements" breadcrumbItem="Colors" />
          <Row>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bg-light rounded-3 text-center overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-primary" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-primary" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-primary">Primary</h5>
                      <p className="mb-0 text-primary">Hex : #038edc</p>
                      <p className="mb-0 text-primary">RGB : rgb(3, 142, 220)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bg-light text-center rounded-3 overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-success" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-success" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-success">Success</h5>
                      <p className="mb-0 text-success">Hex : #51d28c</p>
                      <p className="mb-0 text-success">RGB : rgb(81, 210, 75)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bg-light text-center rounded-3 overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-purple" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-purple" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-purple">Purple</h5>
                      <p className="mb-0 text-purple">Hex : #564ab1</p>
                      <p className="mb-0 text-purple">RGB : rgb(86, 74, 177)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bg-light text-center rounded-3 overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-warning" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-warning" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-warning">Warning</h5>
                      <p className="mb-0 text-warning">Hex : #f7cc53</p>
                      <p className="mb-0 text-warning">RGB : rgb(247, 204, 83)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bg-light text-center rounded-3 overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-danger" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-danger" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-danger">Danger</h5>
                      <p className="mb-0 text-danger">Hex : #f34e4e</p>
                      <p className="mb-0 text-danger">RGB : rgb(243, 78, 78)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bg-light text-center rounded-3 overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-info" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-info" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-info">Info</h5>
                      <p className="mb-0 text-info">Hex : #5fd0f3</p>
                      <p className="mb-0 text-info">RGB : rgb(39, 187, 232)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bg-light text-center rounded-3 overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-secondary" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-secondary" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-secondary">Secondary</h5>
                      <p className="mb-0 text-secondary">Hex : #74788d</p>
                      <p className="mb-0 text-secondary">RGB : rgb(116, 120, 141)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bg-light text-center rounded-3 overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-dark" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-dark" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-dark">Dark</h5>
                      <p className="mb-0 text-dark">Hex : #343a40</p>
                      <p className="mb-0 text-dark">RGB : rgb(52, 58, 64)</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={3} md={6}>
              <Card>
                <CardBody>
                  <div className="bglight text-center rounded-3 overflow-hidden">
                    <Row className="g-0">
                      <Col xl={6}>
                        <div className="bg-soft-light" style={{ height: "90px" }}></div>
                      </Col>
                      <Col xl={6}>
                        <div className="bg-light" style={{ height: "90px" }}></div>
                      </Col>
                    </Row>
                    <div className="py-3">
                      <h5 className="font-size-16 text-dark">Light</h5>
                      <p className="mb-0 text-dark">Hex : #f5f6f8</p>
                      <p className="mb-0 text-dark">RGB : rgb(116, 120, 141)</p>
                    </div>
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

export default UiColors;
