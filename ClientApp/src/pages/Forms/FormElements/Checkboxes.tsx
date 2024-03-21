import React from "react";
import { Card, CardBody, CardHeader, Col, Row, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";

const Checkboxes = () => {
    return (
        <React.Fragment>

            <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                    <h4 className="card-title">Checkboxes</h4>
                    <Link to="//reactstrap.github.io/components/form/" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col md={5}>
                            <div>
                                <h5 className="font-size-13 text-uppercase text-muted mb-4"><i className="mdi mdi-chevron-right text-primary me-1"></i> Form Checkboxes</h5>
                                <div className="form-check mb-2">
                                    <Input className="form-check-input" type="checkbox" id="formCheck1" />
                                    <Label className="form-check-label" htmlFor="formCheck1">
                                        Form Checkbox
                                    </Label>
                                </div>
                                <div className="form-check">
                                    <Input className="form-check-input" type="checkbox" id="formCheck2" defaultChecked />
                                    <Label className="form-check-label" htmlFor="formCheck2">
                                        Form Checkbox checked
                                    </Label>
                                </div>
                            </div>
                        </Col>

                        <Col md={6} className="ms-auto">
                            <div className="mt-md-0 mt-4">
                                <h5 className="font-size-13 text-uppercase text-muted mb-4"><i className="mdi mdi-chevron-right text-primary me-1"></i> Form Checkboxes Right</h5>
                                <div>
                                    <div className="form-check form-check-right mb-2">
                                        <Input className="form-check-input" type="checkbox" id="formCheckRight1" />
                                        <Label className="form-check-label" htmlFor="formCheckRight1">
                                            Form Checkbox Right
                                        </Label>
                                    </div>
                                </div>
                                <div>
                                    <div className="form-check form-check-right">
                                        <Input className="form-check-input" type="checkbox" id="formCheckRight2"
                                            defaultChecked />
                                        <Label className="form-check-label" htmlFor="formCheckRight2">
                                            Form Checkbox Right checked
                                        </Label>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </CardBody>
            </Card>

        </React.Fragment>
    );
}

export default Checkboxes;