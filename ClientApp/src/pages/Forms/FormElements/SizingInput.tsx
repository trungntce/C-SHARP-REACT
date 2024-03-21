import React from "react";
import { Card, CardBody, CardHeader, Input, Label, Form } from "reactstrap";
import { Link } from "react-router-dom";

const SizingInput = () => {
    return (
        <React.Fragment>

            <Card className="card-h-100">
                <CardHeader className="justify-content-between d-flex align-items-center">
                    <h4 className="card-title">Sizing</h4>
                    <Link to="//reactstrap.github.io/components/form/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                    <div className="">
                        <Form>
                            <div className="mb-4">
                                <Label className="form-label" htmlFor="default-input">Default input</Label>
                                <Input className="form-control" type="text" id="default-input" placeholder="Default input" />
                            </div>

                            <div className="mb-4">
                                <Label className="form-label" htmlFor="form-sm-input">Form Small input</Label>
                                <Input className="form-control form-control-sm" type="text" id="form-sm-input" placeholder=".form-control-sm" />
                            </div>

                            <div className="mb-0">
                                <Label className="form-label" htmlFor="form-lg-input">Form Large input</Label>
                                <Input className="form-control form-control-lg" type="text" id="form-lg-input" placeholder=".form-control-lg" />
                            </div>

                        </Form>
                    </div>
                </CardBody>
            </Card>

        </React.Fragment>
    );
}

export default SizingInput;