import { Card, CardBody, CardHeader, Col, Row, Label, Input } from "reactstrap";
import { Link } from "react-router-dom";

const Switches = () => {
    return (
        <Card className="card-h-100">
            <CardHeader className="justify-content-between d-flex align-items-center">
                <h4 className="card-title">Switches</h4>
                <Link to="//reactstrap.github.io/components/form/" target="_blank" rel="noreferrer" className="btn btn-sm btn-soft-secondary">Docs <i className="mdi mdi-arrow-right align-middle"></i></Link>

            </CardHeader>
            <CardBody>

                <Row>

                    <Col md={6}>
                        <div>
                            <h5 className="font-size-13 text-uppercase text-muted mb-4"><i className="mdi mdi-chevron-right text-primary me-1"></i>Switch Examples</h5>
                            <div className="form-check form-switch form-switch-md mb-2">
                                <Input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                                <Label className="form-check-label" htmlFor="flexSwitchCheckDefault">Default switch checkbox input</Label>
                            </div>

                            <div className="form-check form-switch form-switch-md mb-2">
                                <Input className="form-check-input" type="checkbox" id="flexSwitchCheckChecked" defaultChecked />
                                <Label className="form-check-label" htmlFor="flexSwitchCheckChecked">Checked switch checkbox input</Label>
                            </div>

                            <div className="form-check form-switch form-switch-md mb-2">
                                <Input className="form-check-input" type="checkbox" id="flexSwitchCheckDisabled" disabled />
                                <Label className="form-check-label" htmlFor="flexSwitchCheckDisabled">Disabled switch checkbox input</Label>
                            </div>

                            <div className="form-check form-switch form-switch-md">
                                <Input className="form-check-input" type="checkbox" id="flexSwitchCheckCheckedDisabled" defaultChecked disabled />
                                <Label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled">Disabled checked switch checkbox input</Label>
                            </div>
                        </div>
                    </Col>

                    <Col md={6}>
                        <div className="mt-4 mt-md-0">
                            <h5 className="font-size-13 text-uppercase text-muted mb-4"><i className="mdi mdi-chevron-right text-primary me-1"></i>Switch sizes</h5>

                            <div className="form-check form-switch mb-2" dir="ltr">
                                <Input type="checkbox" className="form-check-input" id="customSwitchsizesm" defaultChecked />
                                <Label className="form-check-label" htmlFor="customSwitchsizesm">Small Size Switch</Label>
                            </div>

                            <div className="form-check form-switch form-switch-md mb-2" dir="ltr">
                                <Input type="checkbox" className="form-check-input" id="customSwitchsizemd" />
                                <Label className="form-check-label" htmlFor="customSwitchsizemd">Medium Size Switch</Label>
                            </div>

                            <div className="form-check form-switch form-switch-lg mb-0" dir="ltr">
                                <Input type="checkbox" className="form-check-input" id="customSwitchsizelg" defaultChecked />
                                <Label className="form-check-label" htmlFor="customSwitchsizelg">Large Size Switch</Label>
                            </div>
                        </div>
                    </Col>
                </Row>
            </CardBody>
        </Card>
    );
}

export default Switches;