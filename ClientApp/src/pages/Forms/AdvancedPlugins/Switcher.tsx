import React from "react";
import { Col, Input, Label } from "reactstrap";

const Switcher = () => {
    return (
        <React.Fragment>
            <Col xl={6}>
                <h5 className="font-size-14 mb-3">Example Switch</h5>
                <div className="d-flex flex-wrap gap-2">
                    <Input type="checkbox" id="switch1" switch="none" defaultChecked />
                    <Label className="mb-0" htmlFor="switch1" data-on-label="On" data-off-label="Off"></Label>

                    <Input type="checkbox" id="switch2" switch="default" defaultChecked />
                    <Label className="mb-0" htmlFor="switch2" data-on-label="" data-off-label=""></Label>

                    <Input type="checkbox" id="switch3" switch="bool" defaultChecked />
                    <Label className="mb-0" htmlFor="switch3" data-on-label="Yes" data-off-label="No"></Label>

                    <Input type="checkbox" id="switch6" switch="primary" defaultChecked />
                    <Label className="mb-0" htmlFor="switch6" data-on-label="Yes" data-off-label="No"></Label>

                    <Input type="checkbox" id="switch4" switch="success" defaultChecked />
                    <Label className="mb-0" htmlFor="switch4" data-on-label="Yes" data-off-label="No"></Label>

                    <Input type="checkbox" id="switch7" switch="info" defaultChecked />
                    <Label className="mb-0" htmlFor="switch7" data-on-label="Yes" data-off-label="No"></Label>

                    <Input type="checkbox" id="switch5" switch="warning" defaultChecked />
                    <Label className="mb-0" htmlFor="switch5" data-on-label="Yes" data-off-label="No"></Label>

                    <Input type="checkbox" id="switch8" switch="danger" defaultChecked />
                    <Label className="mb-0" htmlFor="switch8" data-on-label="Yes" data-off-label="No"></Label>

                    <Input type="checkbox" id="switch9" switch="dark" defaultChecked />
                    <Label className="mb-0" htmlFor="switch9" data-on-label="Yes" data-off-label="No"></Label>
                </div>
            </Col>
            <Col xl={6}>
                <div className="mt-4 mt-xl-0">
                    <h5 className="font-size-14 mb-3">Square switch</h5>
                    <div className="d-flex flex-wrap gap-2">
                        <div className="square-switch">
                            <Input type="checkbox" id="square-switch1" switch="none" defaultChecked />
                            <Label htmlFor="square-switch1" data-on-label="On"
                                data-off-label="Off"></Label>
                        </div>
                        <div className="square-switch">
                            <Input type="checkbox" id="square-switch2" switch="info" defaultChecked />
                            <Label htmlFor="square-switch2" data-on-label="Yes"
                                data-off-label="No" className="mb-0"></Label>
                        </div>
                        <div className="square-switch">
                            <Input type="checkbox" id="square-switch3" switch="bool" defaultChecked />
                            <Label htmlFor="square-switch3" data-on-label="Yes"
                                data-off-label="No" className="mb-0"></Label>
                        </div>
                    </div>
                </div>
            </Col>
        </React.Fragment>
    );
}

export default Switcher;