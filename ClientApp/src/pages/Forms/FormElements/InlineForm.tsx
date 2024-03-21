import { Card, CardHeader, CardBody, Form, Col, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";

const InlineForm = () => {
    return (
        <div className="col-12">
            <Card>
                <CardHeader className="justify-content-between d-flex align-items-center">
                    <h4 className="card-title"> Inline Forms </h4>
                    <Link to="//reactstrap.github.io/components/form/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>
                </CardHeader>
                <CardBody>
                    <Form className="row gx-3 gy-2 align-items-center">
                        <Col sm={5}>
                            <Label className="visually-hidden" htmlFor="specificSizeInputName">Name</Label>
                            <Input type="text" className="form-control" id="specificSizeInputName" placeholder="Enter Name" />
                        </Col>
                        <Col sm={3}>
                            <Label className="visually-hidden" htmlFor="specificSizeInputGroupUsername">Username</Label>
                            <div className="input-group">
                                <div className="input-group-text">@</div>
                                <Input type="text" className="form-control" id="specificSizeInputGroupUsername" placeholder="Username" />
                            </div>
                        </Col>
                        <div className="col-auto">
                            <div className="form-check">
                                <Input className="form-check-input" type="checkbox" id="autoSizingCheck2" />
                                <Label className="form-check-label" htmlFor="autoSizingCheck2">
                                    Remember me
                                </Label>
                            </div>
                        </div>
                        <div className="col-auto">
                            <Button type="submit" color="primary">Submit</Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
}

export default InlineForm;