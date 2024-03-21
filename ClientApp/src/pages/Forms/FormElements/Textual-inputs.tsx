import React from "react";
import { Col, Input, Label, Row, Card, CardHeader, CardBody } from "reactstrap";
import { Link } from "react-router-dom";

const TextualInputs = () => {
    return (
        <React.Fragment>
            <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                    <h4 className="card-title">Textual inputs</h4>
                    <Link to="//reactstrap.github.io/components/form/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                    <Row>
                        <Col xl={6}>
                            <div>
                                <Row className="mb-3">
                                    <Label htmlFor="example-text-input" className="col-md-2 col-form-label">Text</Label>
                                    <Col md={10}>
                                        <Input className="form-control" type="text" defaultValue="Artisanal kale" id="example-text-input" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Label htmlFor="example-search-input" className="col-md-2 col-form-label">Search</Label>
                                    <Col md={10}>
                                        <Input className="form-control" type="search" defaultValue="How do I shoot web" id="example-search-input" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Label htmlFor="example-email-input" className="col-md-2 col-form-label">Email</Label>
                                    <Col md={10}>
                                        <Input className="form-control" type="email" defaultValue="bootstrap@example.com" id="example-email-input" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Label htmlFor="example-url-input" className="col-md-2 col-form-label">URL</Label>
                                    <Col md={10}>
                                        <Input className="form-control" type="url" defaultValue="https://getbootstrap.com" id="example-url-input" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Label htmlFor="example-tel-input" className="col-md-2 col-form-label">Telephone</Label>
                                    <Col md={10}>
                                        <Input className="form-control" type="tel" defaultValue="1-(555)-555-5555" id="example-tel-input" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Label htmlFor="example-password-input" className="col-md-2 col-form-label">Password</Label>
                                    <Col md={10}>
                                        <Input className="form-control" type="password" defaultValue="hunter2" id="example-password-input" />
                                    </Col>
                                </Row>
                                <Row className="mb-3">
                                    <Label htmlFor="example-number-input" className="col-md-2 col-form-label">Number</Label>
                                    <Col md={10}>
                                        <Input className="form-control" type="number" defaultValue="42" id="example-number-input" />
                                    </Col>
                                </Row>
                                <Row>
                                    <Label htmlFor="example-datetime-local-input" className="col-md-2 col-form-label">Date and time</Label>
                                    <Col md={10}>
                                        <Input className="form-control" type="datetime-local" defaultValue="2019-08-19T13:45:00" id="example-datetime-local-input" />
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <div className="col-xl-6">
                            <Row className="mb-3 mt-3 mt-xl-0">
                                <Label htmlFor="example-date-input" className="col-md-2 col-form-label">Date</Label>
                                <Col md={10}>
                                    <input className="form-control" type="date" defaultValue="2019-08-19" id="example-date-input" />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Label htmlFor="example-month-input" className="col-md-2 col-form-label">Month</Label>
                                <Col md={10}>
                                    <input className="form-control" type="month" defaultValue="2019-08" id="example-month-input" />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Label htmlFor="example-week-input" className="col-md-2 col-form-label">Week</Label>
                                <Col md={10}>
                                    <input className="form-control" type="week" defaultValue="2019-W33" id="example-week-input" />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Label htmlFor="example-time-input" className="col-md-2 col-form-label">Time</Label>
                                <Col md={10}>
                                    <input className="form-control" type="time" defaultValue="13:45:00" id="example-time-input" />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Label htmlFor="example-color-input" className="col-md-2 col-form-label">Color picker</Label>
                                <Col md={10}>
                                    <input type="color" className="form-control form-control-color mw-100" id="example-color-input" defaultValue="#038edc" title="Choose your color" />
                                </Col>
                            </Row>
                            <Row className="mb-3">
                                <Label className="col-md-2 col-form-label">Select</Label>
                                <Col md={10}>
                                    <Input type="select" className="form-select" defaultValue="">
                                        <option value="">Select</option>
                                        <option value="Large select">Large select</option>
                                        <option value="Small select">Small select</option>
                                    </Input>
                                </Col>
                            </Row>
                            <Row>
                                <Label htmlFor="exampleDataList" className="col-md-2 col-form-label">Datalist</Label>
                                <Col md={10}>
                                    <Input className="form-control" list="datalistOptions" id="exampleDataList" placeholder="Type to search..." defaultValue="" />
                                    <datalist id="datalistOptions">
                                        <option value="San Francisco"></option>
                                        <option value="New York"></option>
                                        <option value="Seattle"></option>
                                        <option value="Los Angeles"></option>
                                        <option value="Chicago"></option>
                                    </datalist>
                                </Col>
                            </Row>
                            <Row>
                                <Label htmlFor="exampleDataList" className="col-md-2 col-form-label">Datalist</Label>
                                <Col md={10}>
                                    <Input className="form-control" list="datalistOptions2" id="exampleDataList" placeholder="Type to search..." defaultValue="" />
                                    <datalist id="datalistOptions2" style={{ border: "1px solid red" }}>
                                        <option value="A01">Test</option>
                                        <option value="A02">Prod</option>
                                        <option value="A03">Plan</option>
                                        <option value="A04">Stag</option>
                                    </datalist>
                                </Col>
                            </Row>
                        </div>
                    </Row>
                </CardBody>
            </Card>
        </React.Fragment >
    );
}

export default TextualInputs;