import React from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Container,
  Row,
  UncontrolledAlert,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const UiAlert = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="Ui Elements" breadcrumbItem="Alerts" />

          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Default Alerts</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/alerts"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div className="">
                    <Alert color="primary">
                      A simple primary alert—check it out!
                    </Alert>
                    <Alert color="secondary">
                      A simple secondary alert—check it out!
                    </Alert>
                    <Alert color="success">
                      A simple success alert—check it out!
                    </Alert>
                    <Alert color="purple">
                      A simple success alert—check it out!
                    </Alert>
                    <Alert color="danger">
                      A simple danger alert—check it out!
                    </Alert>
                    <Alert color="warning">
                      A simple warning alert—check it out!
                    </Alert>
                    <Alert color="info">
                      A simple info alert—check it out!
                    </Alert>
                    <Alert color="light">
                      A simple light alert—check it out!
                    </Alert>
                    <Alert color="dark" className="mb-0">
                      A simple dark alert—check it out!
                    </Alert>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="h4">Alerts with Icon</CardTitle>
                  <Link
                    to="//reactstrap.github.io/components/alerts/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <UncontrolledAlert role="alert" color="primary">
                      <i className="uil uil-user-circle me-2"></i>A simple
                      primary alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert role="alert" color="secondary">
                      <i className="uil uil-pen me-2"></i>A simple secondary
                      alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert role="alert" color="success">
                      <i className="uil uil-check me-2"></i>A simple success
                      alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert role="alert" color="purple">
                      <i className="uil uil-bag me-2"></i>A simple purple
                      alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert role="alert" color="danger">
                      <i className="uil uil-exclamation-octagon me-2"></i>A
                      simple danger alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert role="alert" color="warning">
                      <i className="uil uil-exclamation-triangle me-2"></i>A
                      simple warning alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert role="alert" color="info">
                      <i className="uil uil-question-circle me-2"></i>A simple
                      info alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert role="alert" color="light">
                      <i className="uil uil-moon me-2"></i>A simple light
                      alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      role="alert"
                      color="dark"
                      className="mb-0"
                    >
                      <i className="uil uil-location-arrow-alt me-2"></i>A
                      simple dark alert—check it out!
                    </UncontrolledAlert>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Dismissing Alerts</h4>
                  <Link
                    to="//reactstrap.github.io/components/alerts/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <div className="">
                    <UncontrolledAlert color="primary">
                      A simple primary alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert color="secondary">
                      A simple secondary alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert color="success">
                      A simple success alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert color="purple">
                      A simple purple alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert color="danger">
                      A simple danger alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert color="warning">
                      A simple warning alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert color="info">
                      A simple info alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert color="light">
                      A simple light alert—check it out!
                    </UncontrolledAlert>
                    <UncontrolledAlert color="dark" className="mb-0">
                      A simple dark alert—check it out!
                    </UncontrolledAlert>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Alerts Link Color</h4>
                  <Link
                    to="//reactstrap.github.io/components/alerts/"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>

                <CardBody>
                  <Alert color="primary">
                    A simple primary alert with{" "}
                    <Link to="#" className="alert-link">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                  <Alert color="secondary">
                    A simple secondary alert with{" "}
                    <Link to="#" className="alert-link">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                  <Alert color="success">
                    A simple success alert with{" "}
                    <Link to="#" className="alert-link">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                  <Alert color="purple">
                    A simple purple alert with{" "}
                    <Link to="#" className="alert-link">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                  <Alert color="danger">
                    A simple danger alert with{" "}
                    <Link to="#" className="alert-link">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                  <Alert color="warning">
                    A simple warning alert with{" "}
                    <Link to="#" className="alert-link">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                  <Alert color="info">
                    A simple info alert with{" "}
                    <Link to="#" className="alert-link">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                  <Alert color="light">
                    A simple light alert with{" "}
                    <Link to="#" className="alert-link">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                  <Alert color="dark" className="mb-0">
                    A simple dark alert with{" "}
                    <Link to="#" className="alert-link ">
                      an example link
                    </Link>
                    . Give it a click if you like.
                  </Alert>
                </CardBody>
              </Card>
            </Col>

            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Border Alerts</h4>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>

                <CardBody>
                  <div className="">
                    <UncontrolledAlert
                      color="primary"
                      className="alert-top-border"
                    >
                      <i className="uil uil-user-circle text-primary font-size-16 me-2"></i>
                      A simple border primary alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="secondary"
                      className="alert-top-border"
                    >
                      <i className="uil uil-pen font-size-16 text-secondary me-2"></i>
                      A simple border secondary alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="success"
                      className="alert-top-border"
                    >
                      <i className="uil uil-check font-size-16 text-success me-2"></i>
                      A simple border success alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="purple"
                      className="alert-top-border"
                    >
                      <i className="uil uil-bag font-size-16 text-purple me-2"></i>
                      A simple border purple alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="danger"
                      className="alert-top-border"
                    >
                      <i className="uil uil-exclamation-octagon font-size-16 text-danger me-2"></i>
                      A simple border danger alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="warning"
                      className="alert-top-border"
                    >
                      <i className="uil uil-exclamation-triangle font-size-16 text-warning me-2"></i>
                      A simple border warning alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="info"
                      className="alert-top-border"
                    >
                      <i className="uil uil-question-circle font-size-16 text-info me-2"></i>
                      A simple border info alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="light"
                      className="alert-top-border"
                    >
                      <i className="uil uil-moon font-size-16 me-2"></i>A simple
                      border light alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="dark"
                      className="alert-top-border mb-0"
                    >
                      <i className="uil uil-location-arrow-alt font-size-16 text-dark me-2"></i>
                      A simple border dark alert
                    </UncontrolledAlert>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col xl={4}>
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <CardTitle className="H4">Outline Alerts</CardTitle>
                  <p className="m-0 badge badge-soft-primary py-2">
                    Dashonic Only
                  </p>
                </CardHeader>
                <CardBody>
                  <div className="">
                    <UncontrolledAlert
                      color="primary"
                      className="alert-outline"
                    >
                      <i className="uil uil-user-circle text-primary font-size-16 me-2"></i>
                      A simple outline primary alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="secondary"
                      className="alert-outline"
                    >
                      <i className="uil uil-pen font-size-16 text-secondary me-2"></i>
                      A simple outline secondary alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="success"
                      className="alert-outline"
                    >
                      <i className="uil uil-check font-size-16 text-success me-2"></i>
                      A simple outline success alert
                    </UncontrolledAlert>
                    <UncontrolledAlert color="purple" className="alert-outline">
                      <i className="uil uil-bag font-size-16 text-purple me-2"></i>
                      A simple outline purple alert
                    </UncontrolledAlert>
                    <UncontrolledAlert color="danger" className="alert-outline">
                      <i className="uil uil-exclamation-octagon font-size-16 text-danger me-2"></i>
                      A simple outline danger alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="warning"
                      className="alert-outline"
                    >
                      <i className="uil uil-exclamation-triangle font-size-16 text-warning me-2"></i>
                      A simple outline warning alert
                    </UncontrolledAlert>
                    <UncontrolledAlert color="info" className="alert-outline">
                      <i className="uil uil-question-circle font-size-16 text-info me-2"></i>
                      A simple outline info alert
                    </UncontrolledAlert>
                    <UncontrolledAlert color="light" className="alert-outline">
                      <i className="uil uil-moon font-size-16 me-2"></i>A simple
                      outline light alert
                    </UncontrolledAlert>
                    <UncontrolledAlert
                      color="dark"
                      className="alert-outline mb-0"
                    >
                      <i className="uil uil-location-arrow-alt font-size-16 text-dark me-2"></i>
                      A simple outline dark alert
                    </UncontrolledAlert>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-primary mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-secondary mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-success mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-purple mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-danger mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-warning mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-info mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-dark mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col xl="4">
              <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Additional Content</h4>
                  <Link
                    to="https://getbootstrap.com/docs/5.2/components/alerts/#additional-content"
                    target="_blank"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="alert alert-light mb-0" role="alert">
                      <h4 className="alert-heading">Well done!</h4>
                      <p>
                        Aww yeah, you successfully read this important alert
                        message. This example text is going to run a bit longer
                        so that you can see how spacing within an alert works
                        with this kind of content.
                      </p>
                      <hr />
                      <p className="mb-0">
                        Whenever you need to, be sure to use margin utilities to
                        keep things nice and tidy.
                      </p>
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

export default UiAlert;
