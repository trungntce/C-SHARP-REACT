import React, { useState } from "react";
import { Card, CardHeader, Dropdown, DropdownToggle, DropdownItem, DropdownMenu } from "reactstrap";
import SimpleBar from "simplebar-react";
import { trafficSources } from "../../common/data/analytics";

const TrafficSource = () => {
    const [menu1, setMenu1] = useState<boolean>(false);
    return (
        <React.Fragment>
            <Card className="card-h-100">
                <CardHeader className="border-bottom-0">
                    <div className="d-flex align-items-start">
                        <div className="flex-grow-1">
                            <h5 className="card-title">Traffic Source</h5>
                        </div>

                        <div className="flex-shrink-0">
                            <Dropdown
                                isOpen={menu1}
                                toggle={() => setMenu1(!menu1)}
                            >
                                <DropdownToggle tag="a" className="font-size-16 text-muted">
                                    <i className="mdi mdi-dots-horizontal"></i>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                    <DropdownItem to="#">Action</DropdownItem>
                                    <DropdownItem to="#">Another action</DropdownItem>
                                    <DropdownItem to="#">Something else here</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>
                    </div>
                </CardHeader>

                <SimpleBar style={{ height: "230px" }}>
                    <ul className="list-unstyled mb-0">
                        {(trafficSources || []).map((trafficSource: any, key: number) => (
                            <li className="px-4 py-3" key={key}>
                                <div className="d-flex align-items-center">
                                    <div className="flex-shrink-0 me-3">
                                        <div className="avatar-sm">
                                            <div className="avatar-title bg-light text-primary rounded-circle">
                                                #{trafficSource["id"]}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-grow-1 overflow-hidden">
                                        <p className="text-muted mb-1 text-truncate">{trafficSource["websitelink"]}</p>
                                        <h5 className="font-size-16 mb-0 text-truncate">{trafficSource["traffic"]}</h5>
                                    </div>
                                    <div className="flex-shrink-0 align-self-start">
                                        <div className="badge badge-soft-success ms-2">{trafficSource["percentage"]} % <i className="uil uil-arrow-up-right text-success ms-1"></i></div>
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

export default TrafficSource;