import React from "react";
import { Card, CardHeader, Col, Container, Row, CardBody } from "reactstrap";
import logoSm from "../../assets/images/logo-sm.png";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

const Notifications = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumbs */}
          <Breadcrumbs folder="Extended UI" breadcrumbItem="Notifications" />
          <Row>
            <Col xl={12}>
              <Card>
                <CardHeader>
                  <h4 className="card-title">Toast Notifications</h4>
                  <p className="card-title-desc">Toasts are lightweight notifications designed to mimic the push notifications</p>
                </CardHeader>
                <CardBody>

                  <Row>
                    <Col lg={6}>
                      <div className="p-2">
                        <h5 className="font-size-14">Basic</h5>
                        <p className="card-title-desc mb-3">
                          Toasts are as flexible as you need and have very little required markup.
                          At a minimum, we require a single element to contain your
                          “toasted” content and strongly encourage a dismiss button.
                        </p>
                        <div className="toast fade show" role="alert" id="toast1">
                          <div className="toast-header">
                            <img src={logoSm} alt="" className="me-2" height="18" />
                            <strong className="me-auto">Dashonic</strong>
                            <small className="text-muted">11 mins ago</small>
                            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                          </div>
                          <div className="toast-body">
                            Hello, world! This is a toast message.
                          </div>
                        </div>
                      </div>
                    </Col>


                    <Col lg={6}>
                      <div className="p-2">
                        <h5 className="font-size-14">Translucent</h5>
                        <p className="card-title-desc mb-3">
                          Toasts are slightly translucent, too, so they blend over
                          whatever they might appear over. For browsers that
                          support the <code>backdrop-filter</code> CSS property,
                          we’ll also attempt to blur the elements under a toast.
                        </p>
                        <div className="bg-soft-light p-3">
                          <div className="toast fade show" role="alert" id="toast2">
                            <div className="toast-header">
                              {/* <img src={logo} alt="" className="me-2" height="18" /> */}
                              <strong className="me-auto">Dashonic</strong>
                              <small className="text-muted">11 mins ago</small>
                              <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                            </div>
                            <div className="toast-body">
                              Hello, world! This is a toast message.
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg={6}>
                      <div className="p-2 mt-4">
                        <h5 className="font-size-14">Stacking</h5>
                        <p className="card-title-desc mb-3">
                          For systems that generate more notifications, consider using a wrapping element
                          so they can easily stack.
                        </p>
                        <div className="bg-soft-light">
                          <div aria-live="polite" aria-atomic="true" className="position-relative" style={{ minHeight: "230px" }}>

                            <div className="toast-container position-absolute top-0 end-0 p-2 p-lg-3">


                              <div className="toast fade show" role="alert" id="toast3">
                                <div className="toast-header">
                                  {/* <img src={logo} alt="" className="me-2" height="18" /> */}
                                  <strong className="me-auto">Dashonic</strong>
                                  <small className="text-muted">just now</small>
                                  <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                                <div className="toast-body">
                                  See? Just like this.
                                </div>
                              </div>

                              <div className="toast fade show" role="alert" id="toast4">
                                <div className="toast-header">
                                  {/* <img src={logo} alt="" className="me-2" height="18" /> */}
                                  <strong className="me-auto">Dashonic</strong>
                                  <small className="text-muted">2 sec ago</small>
                                  <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                                </div>
                                <div className="toast-body">
                                  Heads up, toasts will stack automatically
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>


                    <Col lg={6}>
                      <div className="p-2 mt-4">
                        <h5 className="font-size-14">Placement</h5>
                        <p className="card-title-desc mb-3">
                          You can also get fancy with flexbox utilities to align toasts horizontally
                          and/or vertically.
                        </p>
                        <div className="bg-soft-light p-2 p-lg-3">

                          <div aria-live="polite" aria-atomic="true" className="d-flex justify-content-center align-items-center w-100" style={{ minHeight: "200px" }}>


                            <div className="toast fade show" role="alert" id="toast5">
                              <div className="toast-header">
                                {/* <img src={logo} alt="" className="me-2" height="18" /> */}
                                <strong className="me-auto">Dashonic</strong>
                                <small>9 min ago</small>
                                <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                              </div>
                              <div className="toast-body">
                                Hello, world! This is a toast message.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Notifications;