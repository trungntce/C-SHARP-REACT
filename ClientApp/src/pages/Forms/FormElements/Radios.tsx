import React from "react";
import { Card, CardBody, CardHeader, Row, Col, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";

const Radios = () => {
    return (
        <Card>
            <CardHeader className="justify-content-between d-flex align-items-center">
                <h4 className="card-title">Radio</h4>
                <Link to="//reactstrap.github.io/components/form/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
            </CardHeader>
            <CardBody>
                <Row>
                    <Col md={5}>
                        <div>
                            <h5 className="font-size-13 text-uppercase text-muted mb-4"><i className="mdi mdi-chevron-right text-primary me-1"></i> Form Radios</h5>
                            <div className="form-check mb-2">
                                <Input className="form-check-input" type="radio" name="formRadios"
                                    id="formRadios1" defaultChecked />
                                <Label className="form-check-label" htmlFor="formRadios1">
                                    Form Radio
                                </Label>
                            </div>
                            <div className="form-check">
                                <Input className="form-check-input" type="radio" name="formRadios"
                                    id="formRadios2" />
                                <Label className="form-check-label" htmlFor="formRadios2">
                                    Form Radio checked
                                </Label>
                            </div>
                        </div>
                    </Col>

                    <Col md={6} className="ms-auto">
                        <div className="mt-md-0 mt-4">
                            <h5 className="font-size-13 text-uppercase text-muted mb-4"><i className="mdi mdi-chevron-right text-primary me-1"></i> Form Radios Right</h5>
                            <div>
                                <div className="form-check form-check-right mb-2">
                                    <Input className="form-check-input" type="radio" name="formRadiosRight"
                                        id="formRadiosRight1" defaultChecked />
                                    <Label className="form-check-label" htmlFor="formRadiosRight1">
                                        Form Radio Right
                                    </Label>
                                </div>
                            </div>

                            <div>
                                <div className="form-check form-check-right">
                                    <Input className="form-check-input" type="radio" name="formRadiosRight"
                                        id="formRadiosRight2" />
                                    <Label className="form-check-label" htmlFor="formRadiosRight2">
                                        Form Radio Right checked
                                    </Label>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default Radios;