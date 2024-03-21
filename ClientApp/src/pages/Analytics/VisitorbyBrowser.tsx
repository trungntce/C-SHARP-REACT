import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import { Card, CardHeader, Progress, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

import { VisitorbyBrowsers } from "../../common/data/analytics";

const VisitorbyBrowser = (props: any) => {
    const [menu1, setMenu1] = useState<boolean>(false);
    const simplebarheight = props.page ? "195px" : "230px";
    return (
        <React.Fragment>
            <Card className="card-h-100">
                <CardHeader className="border-bottom-0">
                    <div className="d-flex align-items-start">
                        <div className="flex-grow-1">
                            <h5 className="card-title">Visitors by Browser</h5>
                        </div>

                        <div className="flex-shrink-0">
                            <Dropdown
                                isOpen={menu1}
                                toggle={() => setMenu1(!menu1)}
                            >
                                <DropdownToggle tag="a" className="font-size-16 text-muted">
                                    <i className="mdi mdi-dots-horizontal"></i>
                                </DropdownToggle>
                                <DropdownMenu>
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">Another action</DropdownItem>
                                    <DropdownItem to="#">Something else here</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </CardHeader>
                <SimpleBar style={{ height: simplebarheight }}>
                    <ul className="list-unstyled unstyled mb-0">
                        {(VisitorbyBrowsers || []).map((visitorbyBrowser: any, key: number) => (
                            <li className={(visitorbyBrowser["id"] === 1 && props.page) ? "px-4 py-3 pt-0" : "px-4 py-3"} key={key}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar-sm">
                                            <div className="avatar-title bg-light text-primary rounded-circle font-size-18">
                                                <i className={visitorbyBrowser["icon"]}></i>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <p className="text-muted mb-2">{visitorbyBrowser["title"]} <span className="float-end fw-medium">{visitorbyBrowser["percentage"]} %</span></p>
                                        <Progress value={visitorbyBrowser["percentage"]} className="animated-progess custom-progress"></Progress>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </SimpleBar>
            </Card>
        </React.Fragment>
    );
};

export default VisitorbyBrowser;