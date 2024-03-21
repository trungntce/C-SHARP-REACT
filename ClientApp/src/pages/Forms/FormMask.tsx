import React from "react";
import {
  Row,
  Col,
  Form,
  Label,
  Card,
  CardBody,
  Container,
  CardHeader
} from "reactstrap";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Common/Breadcrumb";

// Form Mask
import InputMask from "react-input-mask";

const FormMask = () => {
  const ISBN1 = (props: any) => (
    <InputMask
      mask="999-99-999-9999-99-9"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const ISBN2 = (props: any) => (
    <InputMask
      mask="999 99 999 9999 99 9"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const ISBN3 = (props: any) => (
    <InputMask
      mask="999/99/999/9999/99/9"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const IPV4 = (props: any) => (
    <InputMask
      mask="999.999.999.999"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const IPV6 = (props: any) => (
    <InputMask
      mask="****:****:****:*:***:****:****:****"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const TAX = (props: any) => (
    <InputMask
      mask="99-9999999"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const Phone = (props: any) => (
    <InputMask
      mask="(999) 999-9999"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const Currency = (props: any) => (
    <InputMask
      mask="$ 999,999,999.99"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const Date1 = (props: any) => (
    <InputMask
      mask="99/99/9999"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  const Date2 = (props: any) => (
    <InputMask
      mask="99-99-9999"
      value={props.value}
      className="form-control input-color"
      onChange={props.onChange}
    ></InputMask>
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumbs folder="Forms" breadcrumbItem="Form Mask" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="card-header justify-content-between d-flex align-items-center">
                  <h4 className="card-title">Examples</h4>
                  <Link
                    to="//www.npmjs.com/package/react-input-mask"
                    target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-soft-secondary"
                  >
                    Docs <i className="mdi mdi-arrow-right align-middle"></i>
                  </Link>
                </CardHeader>
                <CardBody>

                  <Row>
                    <Col md="6">
                      <div className="p-20">
                        <Form action="#">
                          <div className="mb-4">
                            <Label>ISBN 1</Label>
                            <ISBN1 />
                            <span className="font-13 text-muted">
                              e.g &quot;999-99-999-9999-9&quot;
                            </span>
                          </div>
                          <div className="mb-4">
                            <Label>ISBN 2</Label>
                            <ISBN2 />
                            <span className="font-13 text-muted">
                              999 99 999 9999 9
                            </span>
                          </div>
                          <div className="mb-4">
                            <Label>ISBN 3</Label>
                            <ISBN3 />
                            <span className="font-13 text-muted">
                              999/99/999/9999/9
                            </span>
                          </div>
                          <div className="mb-4">
                            <Label>IPV4</Label>
                            <IPV4 />
                            <span className="font-13 text-muted">
                              192.168.110.310
                            </span>
                          </div>
                          <div className="mb-0">
                            <Label>IPV6</Label>
                            <IPV6 />
                            <span className="font-13 text-muted">
                              4deg:1340:6547:2:540:h8je:ve73:98pd
                            </span>
                          </div>
                        </Form>
                      </div>
                    </Col>

                    <Col md="6">
                      <div className="p-20">
                        <Form action="#">
                          <div className="mb-4">
                            <Label>Tax ID</Label>
                            <TAX />
                            <span className="font-13 text-muted">
                              99-9999999
                            </span>
                          </div>
                          <div className="mb-4">
                            <Label>Phone</Label>
                            <Phone />
                            <span className="font-13 text-muted">
                              (999) 999-9999
                            </span>
                          </div>
                          <div className="mb-4">
                            <Label>Currency</Label>
                            <Currency />
                            <span className="font-13 text-muted">
                              $ 999,999,999.99
                            </span>
                          </div>
                          <div className="mb-4">
                            <Label>Date</Label>
                            <Date1 />
                            <span className="font-13 text-muted">
                              dd/mm/yyyy
                            </span>
                          </div>
                          <div className="mb-0">
                            <Label>Date 2</Label>
                            <Date2 />
                            <span className="font-13 text-muted">
                              dd-mm-yyyy
                            </span>
                          </div>
                        </Form>
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

export default FormMask;
