import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Progress,
  Row,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiProgressbar = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs folder="UI Elements" breadcrumbItem="Progress Bars" />

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Default Examples</CardTitle>
                  <Link to="//reactstrap.github.io/components/progress/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="mb-4">
                      <Progress value={0}></Progress>
                    </div>
                    <div className="mb-4">
                      <Progress value={25}></Progress>
                    </div>
                    <div className="mb-4">
                      <Progress value={50}></Progress>
                    </div>
                    <div className="mb-4">
                      <Progress value={70}></Progress>
                    </div>
                    <div className="mb-4">
                      <Progress value={85}></Progress>
                    </div>
                    <div>
                      <Progress value={100}></Progress>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Backgrounds</CardTitle>
                  <Link to="//reactstrap.github.io/components/progress/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="mb-4">
                      <Progress value={5}></Progress>
                    </div>
                    <div className="mb-4">
                      <Progress color="success" value={15}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress color="info" value={25}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress color="purple" value={35}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress color="warning" value={45}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress color="danger" value={65}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress color="secondary" value={85}></Progress>
                    </div>

                    <div>
                      <Progress color="dark" value={100}></Progress>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Labels Example</CardTitle>
                  <Link to="//reactstrap.github.io/components/progress/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <Progress value={25}>
                      25%
                    </Progress>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Multiple Progressbars</CardTitle>
                  <Link to="//reactstrap.github.io/components/progress/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <Progress multi>
                      <Progress bar value={15}></Progress>
                      <Progress bar color="success" value={30}></Progress>
                      <Progress bar color="info" value={20}></Progress>
                    </Progress>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Height</CardTitle>
                  <Link to="//reactstrap.github.io/components/progress/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <div className="mb-3">
                      <Progress
                        value={25}
                        style={{ height: '3px' }}
                      ></Progress>
                    </div>

                    <Progress
                      value={25}
                      style={{ height: '20px' }}
                    ></Progress>
                  </div>

                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Animated stripes</CardTitle>
                  <Link to="//reactstrap.github.io/components/progress/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <Progress
                      value={75}
                      animated
                      striped
                    ></Progress>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Striped Progress</CardTitle>
                  <Link to="//reactstrap.github.io/components/progress/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <div className="mb-4">
                      <Progress striped value={10}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress striped color="success" value={25}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress striped color="info" value={50}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress striped color="purple" value={62}></Progress>
                    </div>

                    <div className="mb-4">
                      <Progress striped color="warning" value={75}></Progress>
                    </div>

                    <div>
                      <Progress striped color="danger" value={100}></Progress>
                    </div>

                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={6}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Custom progress</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <Progress value={25} color="success" className="animated-progess custom-progress mb-4"></Progress>
                    <Progress value={50} color="info" className="animated-progess custom-progress mb-4"></Progress>
                    <Progress value={62} color="purple" className="animated-progess custom-progress mb-4"></Progress>
                    <Progress value={75} color="warning" className="animated-progess custom-progress mb-4"></Progress>
                    <Progress value={100} color="danger" className="animated-progess custom-progress"></Progress>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xl="6">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h5">Gradient Progress</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">Dashonic Only</p>
                </CardHeader>
                <CardBody>
                  <div>
                  <Progress value={25} className="bg-gradient mb-4"></Progress>
                    <Progress value={50} color="success" className="bg-gradient mb-4"></Progress>
                    <Progress value={62} color="info" className="bg-gradient mb-4"></Progress>
                    <Progress value={75} color="warning" className="bg-gradient mb-4"></Progress>
                    <Progress value={82} color="danger" className="bg-gradient mb-4"></Progress>
                    <Progress value={100} color="purple" className="bg-gradient"></Progress>
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

export default UiProgressbar;
