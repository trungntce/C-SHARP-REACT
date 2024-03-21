import React from "react";
import { Col, Form, Input, Label, Row, Card, CardHeader, CardBody, Button } from "reactstrap";
import { Link } from "react-router-dom";

const Formlayouts = () => {
  return (
    <React.Fragment>
      <Col xl={6}>
        <Card className="card-h-100">
          <CardHeader className="justify-content-between d-flex align-items-center">
            <h4 className="card-title">Form Layouts</h4>
            <Link to="//reactstrap.github.io/components/form/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
          </CardHeader>
          <CardBody>
            <div className="">
              <Form>
                <div className="mb-3">
                  <Label className="form-label" htmlFor="formrow-firstname-input">
                    First name
                  </Label>
                  <Input
                    type="text"
                    className="form-control"
                    id="formrow-firstname-input"
                  />
                </div>

                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label className="form-label" htmlFor="formrow-email-input">
                        Email
                      </Label>
                      <Input
                        type="email"
                        className="form-control"
                        id="formrow-email-input"
                      />
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <Label
                        className="form-label"
                        htmlFor="formrow-password-input"
                      >
                        Password
                      </Label>
                      <Input
                        type="password"
                        className="form-control"
                        id="formrow-password-input"
                      />
                    </div>
                  </Col>
                </Row>

                <div className="form-group">
                  <div className="form-check mt-3">
                    <Input
                      type="checkbox"
                      className="form-check-input"
                      id="formrow-customCheck"
                    />
                    <Label
                      className="form-check-label"
                      htmlFor="formrow-customCheck"
                    >
                      Check me out
                    </Label>
                  </div>
                </div>
                <div className="mt-4">
                  <Button color="primary" type="submit" className="w-md">
                    Submit
                  </Button>
                </div>
              </Form>
            </div>
          </CardBody>
        </Card>
      </Col>
      <Col xl={6}>
        <Card>
          <CardHeader className="justify-content-between d-flex align-items-center">
            <h4 className="card-title">Horizontal Form</h4>
            <Link to="//reactstrap.github.io/components/form/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
          </CardHeader>
          <CardBody>
            <Form>
              <Row className="mb-4">
                <Label htmlFor="horizontal-firstname-input" className="col-sm-3 col-form-label">First name</Label>
                <Col sm={9}>
                  <Input type="text" className="form-control" id="horizontal-firstname-input" />
                </Col>
              </Row>
              <Row className="mb-4">
                <Label htmlFor="horizontal-email-input" className="col-sm-3 col-form-label">Email</Label>
                <Col sm={9}>
                  <Input type="email" className="form-control" id="horizontal-email-input" />
                </Col>
              </Row>
              <Row className="mb-4">
                <Label htmlFor="horizontal-password-input" className="col-sm-3 col-form-label">Password</Label>
                <Col sm={9}>
                  <Input type="password" className="form-control" id="horizontal-password-input" />
                </Col>
              </Row>

              <Row className="justify-content-end">
                <Col sm={9}>
                  <div className="form-check mb-4">
                    <Input type="checkbox" className="form-check-input" id="horizontal-customCheck" />
                    <Label className="form-check-label" htmlFor="horizontal-customCheck">Remember me</Label>
                  </div>
                  <div>
                    <Button type="submit" color="primary" className="w-md">Submit</Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </React.Fragment >
  );
};

export default Formlayouts;
